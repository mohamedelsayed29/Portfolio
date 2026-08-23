import { randomBytes } from 'node:crypto'
import { Resend } from 'resend'

const MAX_BODY_BYTES = 32 * 1024
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
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

class PublicError extends Error {
  constructor(message, status = 400, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

class DeliveryError extends Error {
  constructor(message, details = 'Resend email delivery failed.') {
    super(message)
    this.status = 500
    this.details = details
  }
}

const cleanText = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/\r\n?/g, '\n').trim()
}

const normalizeRequestType = (input) => {
  const requestType = cleanText(input.requestType)
  const type = cleanText(input.type).toLowerCase()
  if (BOOKING_TYPES.has(type)) return { type, requestType: requestType || label(type) }

  const normalizedRequestType = requestType.toLowerCase()
  if (
    cleanText(input.preferredDate) ||
    cleanText(input.preferredTime) ||
    normalizedRequestType.includes('meeting') ||
    normalizedRequestType.includes('consultation')
  ) {
    return { type: 'meeting', requestType }
  }

  return { type: type || 'project', requestType }
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

function validateBooking(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new PublicError('Please check the form and try again.')
  }

  const normalized = normalizeRequestType(input)
  const booking = {
    type: normalized.type,
    requestType: normalized.requestType,
    name: cleanText(input.name),
    email: cleanText(input.email).toLowerCase(),
    company: cleanText(input.company),
    heardFrom: cleanText(input.heardFrom),
    projectSlug: cleanText(input.projectSlug),
    message: cleanText(input.message),
    timezone: cleanText(input.timezone),
    consent: input.consent !== false,
  }

  const details = {}

  if (!BOOKING_TYPES.has(booking.type)) details.type = 'Choose a booking type.'
  if (booking.name.length < 2) details.name = 'Enter your name.'
  if (booking.name.length > 120) details.name = 'Keep your name under 120 characters.'
  if (booking.email.length > 254 || !EMAIL_PATTERN.test(booking.email)) {
    details.email = 'Enter a valid email address.'
  }
  if (booking.company.length > 160) details.company = 'Keep the company name under 160 characters.'
  if (!HEARD_FROM.has(booking.heardFrom)) details.heardFrom = 'Choose a valid source.'
  if (booking.projectSlug.length > 500) details.projectSlug = 'Keep the link under 500 characters.'
  if (booking.message.length > 4000) details.message = 'Keep the message under 4,000 characters.'
  if (booking.timezone.length > 100) details.timezone = 'Choose a valid timezone.'
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
    booking.duration = Number(input.duration || 30)

    const parsedDate = new Date(`${booking.date}T00:00:00.000Z`)
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const latest = new Date(today)
    latest.setUTCDate(latest.getUTCDate() + 90)
    const validDate =
      DATE_PATTERN.test(booking.date) &&
      !Number.isNaN(parsedDate.valueOf()) &&
      parsedDate.toISOString().slice(0, 10) === booking.date &&
      parsedDate >= today &&
      parsedDate <= latest

    if (!validDate) details.date = 'Choose a valid upcoming date.'
    if (!TIME_PATTERN.test(booking.time)) details.time = 'Choose a valid time.'
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
    rows.push(['Budget', label(booking.budget)])
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
  const subjectName = booking.company ? `${booking.name} / ${booking.company}` : booking.name
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
  const apiKey = env.RESEND_API_KEY

  console.log('API key exists:', Boolean(apiKey))

  if (!apiKey) {
    throw new PublicError('Email delivery is not configured. Please add RESEND_API_KEY.', 500)
  }

  const resend = new Resend(apiKey)
  const payload = {
    from: BOOKING_FROM_EMAIL,
    to: [BOOKING_TO_EMAIL],
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  }

  console.log('Resend payload:', payload)

  let result
  try {
    result = await resend.emails.send(payload)
  } catch (error) {
    logResendError(error)
    throw new DeliveryError(
      error instanceof Error ? error.message : 'Resend API request failed.',
      'Resend API request failed. Check the server logs for the full error.',
    )
  }

  const { data, error } = result

  if (error) {
    logResendError(error)
    throw new DeliveryError(
      error.message || 'Resend rejected the booking email.',
      error.message || 'Resend rejected the booking email.',
    )
  }

  return data
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

function getRequestIp(request) {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return request.socket?.remoteAddress || 'unknown'
}

function originIsAllowed(request, env) {
  const origin = request.headers.origin
  if (!origin) return true

  const configured = cleanText(env.BOOKING_ALLOWED_ORIGINS)
  if (configured) {
    return configured
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .includes(origin)
  }

  try {
    const forwardedHost = request.headers['x-forwarded-host']
    const host = typeof forwardedHost === 'string' ? forwardedHost : request.headers.host
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0
    let tooLarge = false
    const chunks = []

    request.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        tooLarge = true
        return
      }
      chunks.push(chunk)
    })

    request.on('end', () => {
      if (tooLarge) {
        reject(new PublicError('This booking request is too large.', 413))
        return
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new PublicError('Please send a valid booking request.'))
      }
    })

    request.on('error', reject)
  })
}

function sendJson(response, status, payload, headers = {}) {
  console.log('Booking API response:', {
    status,
    message: payload?.message,
    success: payload?.success,
    details: payload?.details,
  })

  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  })
  response.end(JSON.stringify(payload))
}

function logResendError(error) {
  console.error('Resend error diagnostics:', {
    name: error?.name,
    message: error?.message,
    response: error?.response,
    statusCode: error?.statusCode,
    status: error?.status,
    cause: error?.cause,
    raw: error,
  })
}

export function createBookingRequestHandler(options = {}) {
  const env = options.env ?? process.env
  const rateLimits = new Map()

  return async function bookingRequestHandler(request, response) {
    if (request.method !== 'POST') {
      sendJson(response, 405, { message: 'Method not allowed.' }, { Allow: 'POST' })
      return
    }

    if (!originIsAllowed(request, env)) {
      sendJson(response, 403, { message: 'This booking request was not accepted.' })
      return
    }

    if (!String(request.headers['content-type'] || '').toLowerCase().includes('application/json')) {
      sendJson(response, 415, { message: 'Please send the booking as JSON.' })
      return
    }

    const now = Date.now()
    const ip = getRequestIp(request)
    const recent = (rateLimits.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

    if (recent.length >= RATE_LIMIT_MAX) {
      sendJson(
        response,
        429,
        { message: 'Too many booking attempts. Please wait a few minutes and try again.' },
        { 'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) },
      )
      return
    }

    recent.push(now)
    rateLimits.set(ip, recent)

    try {
      const payload = await readJson(request)
      const result = await processBooking(payload, options)
      sendJson(response, 200, result)
    } catch (error) {
      if (error instanceof PublicError) {
        sendJson(response, error.status, { message: error.message, details: error.details })
        return
      }

      if (error instanceof DeliveryError) {
        logResendError(error)
        console.error('Booking delivery failed:', error.message)
        sendJson(response, error.status, {
          message: 'We could not send your request.',
          details: error.details,
        })
        return
      }

      logResendError(error)
      console.error('Booking delivery failed:', error instanceof Error ? error.message : 'Unknown error')
      sendJson(response, 500, {
        message: 'We could not send your request. Please try again in a moment.',
      })
    }
  }
}
