import { randomBytes, randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { createRateLimiter, attemptPolicies, deliveryPolicies } from './rate-limit.js'
import { PublicError, unavailable, allowedOrigins, assertBrowserRequest, createClientIpResolver, ipRateKey, verifyTurnstile } from './security.js'

const MAX_BODY_BYTES = 16 * 1024
const BODY_TIMEOUT_MS = 10_000
const MAX_CONCURRENT_REQUESTS = 8
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/
const BOOKING_TYPES = new Set(['meeting', 'project'])
const MEETING_DURATIONS = new Set([30, 60, 90])
const SERVICES = new Set(['frontend', 'backend', 'mobile', 'ai', 'bugfix', 'solutions'])
const BUDGETS = new Set(['under-5k', '5k-15k', '15k-40k', '40k-100k', '100k-plus', 'unsure'])
const TIMELINES = new Set(['asap', '1-month', 'quarter', 'exploring'])
const HEARD_FROM = new Set(['', 'search', 'referral', 'social', 'event', 'other'])
const BOOKING_FROM_EMAIL = 'booking@hammerload.com'
const BOOKING_TO_EMAIL = 'contact@hammerload.com'

const SINGLE_LINE_CONTROL = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u
// eslint-disable-next-line no-control-regex -- Reject unsafe control bytes in submitted prose.
const MESSAGE_CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u202A-\u202E\u2066-\u2069]/u
const NAME_PATTERN = /^[\p{L}\p{M} .'’-]+$/u
const STRING_FIELDS = new Set([
  'type', 'requestType', 'name', 'email', 'company', 'heardFrom', 'projectSlug',
  'message', 'timezone', 'service', 'budget', 'timeline', 'date', 'time',
  'preferredDate', 'preferredTime', 'turnstileToken', 'bookingVerification',
])
const ALLOWED_FIELDS = new Set([...STRING_FIELDS, 'consent', 'duration'])
const MEETING_TIMES = new Set(['09:00', '09:30', '10:00', '11:00', '13:00', '13:30', '14:00', '15:00', '16:00', '16:30'])
const cleanText = (value) => typeof value === 'string' ? value.normalize('NFC').replace(/\r\n?/g, '\n').trim() : ''

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

export function validateBooking(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new PublicError('Please check the form and try again.')
  }

  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_FIELDS.has(key) || (STRING_FIELDS.has(key) && typeof value !== 'string')) {
      throw new PublicError('Please check the form and try again.')
    }
    if (typeof value === 'string' && (value.length > (key === 'message' ? 4000 : key === 'turnstileToken' ? 2048 : 500) ||
        (key === 'message' ? MESSAGE_CONTROL : SINGLE_LINE_CONTROL).test(value))) {
      throw new PublicError('Please check the highlighted booking details.', 400, { [key]: 'Enter valid text without control characters.' })
    }
  }
  if (input.bookingVerification) throw new PublicError('This booking request was not accepted.', 400)
  if ((input.date && input.preferredDate && input.date !== input.preferredDate) ||
      (input.time && input.preferredTime && input.time !== input.preferredTime)) {
    throw new PublicError('Please choose one consistent meeting date and time.')
  }
  if (input.duration !== undefined && ![30, 60, 90, '30', '60', '90'].includes(input.duration)) {
    throw new PublicError('Choose a valid duration.', 400, { duration: 'Choose a valid duration.' })
  }
  const booking = {
    type: cleanText(input.type),
    requestType: cleanText(input.type) === 'meeting' ? 'Meeting' : 'Project',
    name: cleanText(input.name),
    email: cleanText(input.email).toLowerCase(),
    company: cleanText(input.company),
    heardFrom: cleanText(input.heardFrom),
    projectSlug: cleanText(input.projectSlug),
    message: cleanText(input.message),
    timezone: cleanText(input.timezone),
    consent: input.consent === true,
  }

  const details = {}

  if (!BOOKING_TYPES.has(booking.type)) details.type = 'Choose a booking type.'
  if (booking.name.length < 2 || !NAME_PATTERN.test(booking.name) || !/\p{L}/u.test(booking.name)) {
    details.name = 'Enter your name using letters, spaces, apostrophes or hyphens.'
  }
  if (booking.name.length > 120) details.name = 'Keep your name under 120 characters.'
  if (booking.email.length > 254 || !EMAIL_PATTERN.test(booking.email) || booking.email.split('@')[0].length > 64 || /(^\.|\.$|\.\.)/.test(booking.email.split('@')[0])) {
    details.email = 'Enter a valid email address.'
  }
  if (booking.company.length > 160) details.company = 'Keep the company name under 160 characters.'
  if (!HEARD_FROM.has(booking.heardFrom)) details.heardFrom = 'Choose a valid source.'
  if (booking.projectSlug) {
    let validLink = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(booking.projectSlug)
    try {
      const url = new URL(booking.projectSlug)
      validLink = ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
    } catch { /* A project slug is also accepted; URLs are never fetched. */ }
    if (!validLink) details.projectSlug = 'Enter an HTTP(S) link or a project slug.'
  }
  if (booking.message.length > 4000) details.message = 'Keep the message under 4,000 characters.'
  if (booking.timezone) {
    try { new Intl.DateTimeFormat('en', { timeZone: booking.timezone }) }
    catch { details.timezone = 'Choose a valid timezone.' }
  }
  if (!booking.consent) details.consent = 'Permission to reply is required.'

  if (booking.type === 'project') {
    booking.service = cleanText(input.service)
    booking.budget = cleanText(input.budget)
    booking.timeline = cleanText(input.timeline)

    if (!SERVICES.has(booking.service)) details.service = 'Choose a valid service.'
    if (!BUDGETS.has(booking.budget)) details.budget = 'Choose a valid budget range.'
    if (!TIMELINES.has(booking.timeline)) details.timeline = 'Choose a valid timeline.'
    if (booking.message.length < 30) details.message = 'Add at least 30 characters.'
  }

  if (booking.type === 'meeting') {
    booking.date = cleanText(input.preferredDate) || cleanText(input.date)
    booking.time = cleanText(input.preferredTime) || cleanText(input.time)
    booking.duration = Number(input.duration ?? 30)

    const parsedDate = new Date(`${booking.date}T00:00:00.000Z`)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const latest = new Date(today)
    latest.setUTCDate(latest.getUTCDate() + 30)
    const validDate =
      DATE_PATTERN.test(booking.date) &&
      !Number.isNaN(parsedDate.valueOf()) &&
      parsedDate.toISOString().slice(0, 10) === booking.date &&
      parsedDate >= today &&
      parsedDate <= latest &&
      parsedDate.getUTCDay() !== 0 && parsedDate.getUTCDay() !== 6

    if (!validDate) details.date = 'Choose a valid upcoming date.'
    if (!TIME_PATTERN.test(booking.time) || !MEETING_TIMES.has(booking.time)) details.time = 'Choose a valid time.'
    if (!MEETING_DURATIONS.has(booking.duration)) details.duration = 'Choose a valid duration.'
  }

  if (Object.keys(details).length > 0) {
    throw new PublicError('Please check the highlighted booking details.', 400, details)
  }

  return booking
}

const label = (value) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

function bookingRows(booking, submittedAt) {
  const rows = [
    ['Request type', booking.requestType || label(booking.type)],
    ['Name', booking.name],
    ['Email', booking.email],
  ]

  if (booking.company) rows.push(['Company', booking.company])

  if (booking.type === 'meeting') {
    rows.push(['Preferred date', booking.date])
    rows.push(['Preferred time', booking.time])
    rows.push(['Duration', `${booking.duration} minutes`])
  } else {
    rows.push(['Service', label(booking.service)])
    rows.push(['Budget', booking.budget === 'unsure' ? 'Not sure yet' : `${label(booking.budget)} EGP`])
    rows.push(['Timeline', label(booking.timeline)])
  }

  if (booking.timezone) rows.push(['Timezone', booking.timezone])
  if (booking.projectSlug) rows.push(['Project or product link', booking.projectSlug])
  if (booking.heardFrom) rows.push(['How they found us', label(booking.heardFrom)])
  if (booking.message) rows.push(['Message', booking.message])
  rows.push(['Submitted', submittedAt])

  return rows
}

export function buildBookingEmail(booking, submittedAt = new Date().toISOString()) {
  const rows = bookingRows(booking, submittedAt)
  const subjectName = (booking.company ? `${booking.name} / ${booking.company}` : booking.name)
    .replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ').slice(0, 180)
  const subject = `New HammerLoad booking request - ${subjectName}`
  const text = [
    'New HammerLoad booking request',
    '',
    ...rows.flatMap(([key, value]) => [`${key}:`, value, '']),
  ].join('\n')
  const htmlRows = rows
    .map(
      ([key, value]) => `
        <tr>
          <th style="padding:12px 16px;text-align:left;vertical-align:top;color:#0B1F3A;font-size:13px;font-weight:700;border-bottom:1px solid #edf0f4;background:#fbfcfd">${escapeHtml(key)}</th>
          <td style="padding:12px 16px;color:#233044;font-size:14px;line-height:1.55;white-space:pre-wrap;border-bottom:1px solid #edf0f4">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:28px;background:#ffffff;font-family:Arial,sans-serif">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #edf0f4;border-radius:18px;overflow:hidden">
      <div style="padding:26px 28px;background:#ffffff;border-bottom:4px solid #E08B2E">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#E08B2E;font-weight:700">HammerLoad</div>
        <h1 style="margin:8px 0 0;color:#0B1F3A;font-size:24px;line-height:1.25">New HammerLoad booking request</h1>
      </div>
      <table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table>
    </div>
  </body>
</html>`

  return { subject, text, html }
}

export async function sendWithResend(message, env = process.env) {
  if (!env.RESEND_API_KEY) throw unavailable()
  // Fixed destination and no redirects: submitted URLs cannot influence this
  // connection. A timeout also bounds the number of in-flight deliveries.
  const resend = new Resend(env.RESEND_API_KEY, { baseUrl: 'https://api.resend.com' })
  let result
  try {
    result = await resend.emails.send({
      from: BOOKING_FROM_EMAIL,
      to: [BOOKING_TO_EMAIL],
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }, { signal: AbortSignal.timeout(10_000), redirect: 'error', idempotencyKey: randomUUID() })
  } catch {
    throw unavailable()
  }
  if (result?.error || !result?.data?.id) throw unavailable()
  return result.data
}

export async function processBooking(input, options = {}) {
  const env = options.env ?? process.env
  const sendEmail = options.sendEmail ?? sendWithResend
  const booking = validateBooking(input)
  const receivedAt = new Date().toISOString()
  const email = buildBookingEmail(booking, receivedAt)

  const delivery = await sendEmail(
    {
      ...email,
      to: BOOKING_TO_EMAIL,
      replyTo: booking.email,
    },
    env,
  )

  return {
    success: true,
    reference: `HL-${randomBytes(4).toString('hex').toUpperCase()}`,
    receivedAt,
    emailId: delivery?.id,
    type: booking.type,
    email: booking.email,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
  }
}

export function readJson(request, { maxBytes = MAX_BODY_BYTES, timeoutMs = BODY_TIMEOUT_MS } = {}) {
  const length = request.headers['content-length']
  if (length !== undefined && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
    throw new PublicError('This booking request is too large.', 413)
  }
  return new Promise((resolve, reject) => {
    let size = 0
    let settled = false
    const chunks = []
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      request.off('data', onData)
      request.off('end', onEnd)
      request.off('aborted', onAborted)
      request.off('error', onError)
      if (error) {
        // Do not drain an unlimited stream after exceeding the bound. The
        // handler replies with Connection: close and closes that connection.
        request.pause()
        request.once('error', () => {})
        reject(error)
      } else resolve(value)
    }
    const onData = (chunk) => {
      size += chunk.length
      if (size > maxBytes) finish(new PublicError('This booking request is too large.', 413))
      else chunks.push(chunk)
    }
    const onEnd = () => {
      try { finish(null, JSON.parse(Buffer.concat(chunks).toString('utf8'))) }
      catch { finish(new PublicError('Please send a valid booking request.')) }
    }
    const onAborted = () => finish(new PublicError('Incomplete booking request.'))
    const onError = () => finish(new PublicError('Incomplete booking request.'))
    const timer = setTimeout(() => finish(new PublicError('This booking request took too long.', 408)), timeoutMs)
    timer.unref?.()
    request.on('data', onData)
    request.on('end', onEnd)
    request.on('aborted', onAborted)
    request.on('error', onError)
  })
}

function sendJson(response, status, payload, headers = {}) {
  if (response.destroyed || response.writableEnded) return
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    ...headers,
  })
  response.end(JSON.stringify(payload))
}

export function createBookingRequestHandler(options = {}) {
  const env = options.env ?? process.env
  const origins = allowedOrigins(env)
  const resolveIp = createClientIpResolver(env.BOOKING_TRUSTED_PROXIES || '')
  const limiter = options.rateLimiter ?? createRateLimiter({ stateFile: env.BOOKING_RATE_LIMIT_FILE })
  const verifyBot = options.verifyBot ?? ((token, ip) => verifyTurnstile(token, ip, { env, origins, fetchImpl: options.fetchImpl }))
  let activeRequests = 0

  return async function bookingRequestHandler(request, response) {
    const requestId = randomUUID()
    let admitted = false
    try {
      if (activeRequests >= MAX_CONCURRENT_REQUESTS) throw unavailable()
      activeRequests += 1
      admitted = true
      if (env.NODE_ENV === 'production' && !env.BOOKING_RATE_LIMIT_FILE && !options.rateLimiter) throw unavailable()
      const ip = resolveIp(request)
      // Invalid requests, missing origins and methods also spend an attempt.
      await limiter.consume(attemptPolicies(ipRateKey(ip)))
      if (request.method !== 'POST') {
        sendJson(response, 405, { message: 'Method not allowed.' }, { Allow: 'POST', Connection: 'close' })
        return
      }
      assertBrowserRequest(request, origins)
      const payload = await readJson(request, options.bodyLimits)
      const booking = validateBooking(payload)
      // Verification is required; missing keys or provider outages fail closed.
      await verifyBot(payload.turnstileToken, ip)
      await limiter.consume(deliveryPolicies(booking.email))
      const result = await processBooking(payload, options)
      sendJson(response, 200, result)
    } catch (error) {
      const status = error instanceof PublicError ? error.status : 503
      const headers = { 'X-Request-ID': requestId }
      if (error.retryAfter) headers['Retry-After'] = String(error.retryAfter)
      // Never leave an unread or oversized body on a keep-alive connection.
      if (!request.complete) headers.Connection = 'close'
      sendJson(response, status, {
        message: error instanceof PublicError ? error.message : 'We could not send your request. Please try again later.',
        ...(error instanceof PublicError && error.details ? { details: error.details } : {}),
      }, headers)
      if (status >= 500) {
        // No names, emails, message bodies, tokens, keys or provider internals.
        console.error('Booking request failed', { requestId, status })
      }
    } finally {
      if (admitted) activeRequests -= 1
    }
  }
}
