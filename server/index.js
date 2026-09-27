import { createReadStream, existsSync, readFileSync, realpathSync } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { securityHeaders } from './headers.js'
import { createBookingRequestHandler } from './booking.js'

const defaultRoot = fileURLToPath(new URL('../dist', import.meta.url))

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue
    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }
}

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

export function createPortfolioServer({ rootDirectory = defaultRoot, bookingOptions } = {}) {
  const root = realpathSync(rootDirectory)
  const htmlHeaders = new Map()
  // Both routes share the same quota and concurrency protections.
  const bookingHandler = createBookingRequestHandler(bookingOptions)

  const insideRoot = (file) => file === root || file.startsWith(root + sep)
  const server = createServer({ requestTimeout: 15_000, headersTimeout: 10_000, keepAliveTimeout: 5000, maxHeaderSize: 8192 }, async (request, response) => {
    request.on('error', () => {})
    const reply = (status, message, extra = {}) => {
      response.writeHead(status, { ...securityHeaders(), 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8', ...extra })
      response.end(request.method === 'HEAD' ? undefined : message)
    }
    try {
      let pathname
      try {
        pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
        // eslint-disable-next-line no-control-regex -- Reject invalid path control bytes.
        if (/[\x00-\x1F\x7F\\]/.test(pathname)) throw new Error('Invalid path')
      } catch {
        reply(400, 'Bad request')
        return
      }

      if (pathname === '/api/send-booking' || pathname === '/api/bookings') {
        await bookingHandler(request, response)
        return
      }
      if (pathname === '/api' || pathname.startsWith('/api/')) {
        reply(404, 'Not found')
        return
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        reply(405, 'Method not allowed', { Allow: 'GET, HEAD', Connection: 'close' })
        return
      }
      if (pathname === '/health') {
        response.writeHead(200, { ...securityHeaders(), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ ok: true }))
        return
      }

      const candidate = resolve(root, `.${pathname}`)
      if (!insideRoot(candidate)) {
        reply(404, 'Not found')
        return
      }
      let file = candidate
      try {
        const details = await stat(candidate)
        if (details.isDirectory()) file = join(candidate, 'index.html')
        await stat(file)
      } catch {
        // Routes receive the SPA shell; missing assets do not receive HTML.
        if (extname(pathname) || pathname.startsWith('/assets/') || pathname.startsWith('/brand/')) {
          reply(404, 'Not found')
          return
        }
        file = join(root, 'index.html')
      }
      file = await realpath(file)
      const extension = extname(file).toLowerCase()
      if (!insideRoot(file) || !CONTENT_TYPES[extension]) {
        reply(404, 'Not found')
        return
      }
      let headers = securityHeaders()
      if (extension === '.html') {
        if (!htmlHeaders.has(file)) htmlHeaders.set(file, securityHeaders(readFileSync(file, 'utf8')))
        headers = htmlHeaders.get(file)
      }
      response.writeHead(200, {
        ...headers,
        'Content-Type': CONTENT_TYPES[extension],
        'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
      })
      if (request.method === 'HEAD') response.end()
      else createReadStream(file).on('error', () => response.destroy()).pipe(response)
    } catch {
      if (!response.headersSent) reply(500, 'Request failed')
      else response.destroy()
    }
  })
  server.maxRequestsPerSocket = 100
  server.maxConnections = 256
  server.setTimeout(15_000, (socket) => socket.destroy())
  return server
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  loadEnvFile('.env')
  loadEnvFile('.env.local')
  const port = Number(process.env.PORT || 4000)
  createPortfolioServer().listen(port, () => {
    console.log(`HammerLoad server listening on http://localhost:${port}`)
  })
}
