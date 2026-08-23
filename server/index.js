import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createBookingRequestHandler } from './booking.js'

const root = fileURLToPath(new URL('../dist', import.meta.url))
const port = Number(process.env.PORT || 4000)

function loadEnvFile(path) {
  if (!existsSync(path)) return

  const contents = readFileSync(path, 'utf8')
  for (const line of contents.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    if (!key || process.env[key] !== undefined) continue

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const bookingHandler = createBookingRequestHandler()

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function serveFile(response, path) {
  const extension = extname(path).toLowerCase()
  response.writeHead(200, {
    'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
  })
  createReadStream(path).pipe(response)
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname

  if (pathname === '/api/send-booking' || pathname === '/api/bookings') {
    await bookingHandler(request, response)
    return
  }

  if (pathname === '/health') {
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })
    response.end(JSON.stringify({ ok: true }))
    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end()
    return
  }

  const requested = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '')
  const candidate = join(root, requested === '/' ? 'index.html' : requested)
  let file = candidate

  try {
    const details = await stat(candidate)
    if (details.isDirectory()) file = join(candidate, 'index.html')
  } catch {
    file = join(root, 'index.html')
  }

  if (!file.startsWith(root) || !existsSync(file)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  if (request.method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(file)] || 'text/html' })
    response.end()
    return
  }

  serveFile(response, file)
})

server.listen(port, () => {
  console.log(`HammerLoad server listening on http://localhost:${port}`)
})
