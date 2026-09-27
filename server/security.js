import ipaddr from 'ipaddr.js'

export class PublicError extends Error {
  constructor(message, status = 400, details, retryAfter) {
    super(message)
    this.status = status
    this.details = details
    this.retryAfter = retryAfter
  }
}

export const unavailable = () => new PublicError('Booking is temporarily unavailable. Please email us instead.', 503, undefined, 60)

export function normalizeIp(value) {
  if (typeof value !== 'string' || !ipaddr.isValid(value) || value.includes('%')) return null
  const address = ipaddr.process(value)
  return address.toString()
}

// Limit an IPv6 network together, so rotating addresses within one /64 does
// not give a visitor a fresh quota. IPv4-mapped IPv6 has the IPv4 quota.
export function ipRateKey(value) {
  const address = ipaddr.process(value)
  if (address.kind() === 'ipv4') return address.toString()
  return `${address.parts.slice(0, 4).map((part) => part.toString(16)).join(':')}::/64`
}

export function createClientIpResolver(configured = '') {
  const trusted = configured.split(',').map((value) => value.trim()).filter(Boolean).map((value) => {
    const range = ipaddr.parseCIDR(value.includes('/') ? value : `${value}/${value.includes(':') ? 128 : 32}`)
    // Broad "trust everyone" settings defeat the purpose of this check.
    if (range[1] === 0) throw new Error('BOOKING_TRUSTED_PROXIES must identify actual proxy addresses.')
    return range
  })

  return (request) => {
    const peer = normalizeIp(request.socket?.remoteAddress)
    if (!peer) throw new PublicError('This booking request was not accepted.', 403)
    const address = ipaddr.process(peer)
    const fromProxy = trusted.some(([network, bits]) => network.kind() === address.kind() && address.match(network, bits))
    if (!fromProxy) return peer

    // Nginx must OVERWRITE X-Real-IP with its verified $remote_addr. Never
    // trust the first entry of a client-controlled X-Forwarded-For chain.
    const forwarded = normalizeIp(request.headers['x-real-ip'])
    if (!forwarded) throw new PublicError('This booking request was not accepted.', 403)
    return forwarded
  }
}

export function allowedOrigins(env) {
  const values = (env.BOOKING_ALLOWED_ORIGINS || 'https://hammerload.com,https://www.hammerload.com')
    .split(',').map((value) => value.trim()).filter(Boolean)
  return new Set(values.map((value) => {
    const url = new URL(value)
    if (url.origin !== value || url.username || url.password || !['https:', 'http:'].includes(url.protocol)) {
      throw new Error('BOOKING_ALLOWED_ORIGINS must contain exact HTTP(S) origins.')
    }
    if (env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error('Production booking origins must use HTTPS.')
    }
    return value
  }))
}

export function assertBrowserRequest(request, origins) {
  if (typeof request.headers.origin !== 'string' || !origins.has(request.headers.origin)) {
    throw new PublicError('This booking request was not accepted.', 403)
  }
  const site = request.headers['sec-fetch-site']
  if (site && site !== 'same-origin') throw new PublicError('This booking request was not accepted.', 403)
  const type = String(request.headers['content-type'] || '')
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?\s*$/i.test(type)) {
    throw new PublicError('Please send the booking as JSON.', 415)
  }
  if (request.headers['content-encoding'] && request.headers['content-encoding'] !== 'identity') {
    throw new PublicError('Compressed booking requests are not accepted.', 415)
  }
}

export async function verifyTurnstile(token, ip, { env, origins, fetchImpl = fetch }) {
  if (!env.TURNSTILE_SECRET_KEY) throw unavailable()
  if (typeof token !== 'string' || token.length < 1 || token.length > 2048) {
    throw new PublicError('Please complete the security check and try again.', 403)
  }
  let response, result
  try {
    response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    })
    if (!response.ok) throw unavailable()
    result = await response.json()
  } catch {
    throw unavailable()
  }
  const hostnames = new Set([...origins].map((origin) => new URL(origin).hostname))
  const timestamp = Date.parse(result?.challenge_ts)
  const age = Date.now() - timestamp
  if (result?.success !== true || result.action !== 'booking' || !hostnames.has(result.hostname) ||
      !Number.isFinite(age) || age < -30_000 || age > 300_000) {
    throw new PublicError('Please complete a new security check and try again.', 403)
  }
}
