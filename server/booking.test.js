import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { afterEach, test } from 'node:test'
import { createBookingRequestHandler, processBooking, sendWithResend } from './booking.js'

const servers = []
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => {
    server.close(resolve)
    server.closeAllConnections()
  })))
})

const ORIGIN = 'https://hammerload.com'
const upcoming = new Date()
upcoming.setUTCDate(upcoming.getUTCDate() + 2)
while ([0, 6].includes(upcoming.getUTCDay())) upcoming.setUTCDate(upcoming.getUTCDate() + 1)
const validMeeting = {
  type: 'meeting', name: 'Alex Moreau', email: 'alex@company.com', company: 'Acme Inc.',
  date: upcoming.toISOString().slice(0, 10), time: '10:00', duration: 30,
  message: 'We would like to discuss a product build.', timezone: 'Africa/Cairo',
  consent: true, bookingVerification: '', turnstileToken: 'test-token',
}
const validProject = {
  type: 'project', name: 'أحمد عبد الرحمن', email: 'ahmed@example.com', consent: true,
  service: 'frontend', budget: 'under-5k', timeline: 'asap',
  message: 'We need a website for our growing business.', turnstileToken: 'test-token',
}

async function startHandler(options = {}) {
  const server = createServer(createBookingRequestHandler({
    env: {}, verifyBot: async () => {}, sendEmail: async () => ({ id: 'email-test-id' }), ...options,
  }))
  servers.push(server)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return `http://127.0.0.1:${server.address().port}/api/send-booking`
}
function submit(url, input = validMeeting, headers = {}) {
  return fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: JSON.stringify(input),
  })
}

test('delivers valid Arabic and English bookings only to the fixed recipient', async () => {
  const delivered = []
  const url = await startHandler({ sendEmail: async (message) => { delivered.push(message); return { id: 'mail-id' } } })
  for (const input of [validMeeting, validProject]) {
    const response = await submit(url, input)
    const result = await response.json()
    assert.equal(response.status, 200)
    assert.match(result.reference, /^HL-[A-F0-9]{8}$/)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.equal(delivered[0].to, 'contact@hammerload.com')
  assert.equal(delivered[0].replyTo, validMeeting.email)
  assert.match(delivered[0].text, /Request type:\nMeeting/)
  assert.match(delivered[1].text, /Request type:\nProject/)
})

test('accepts existing preferredDate/preferredTime aliases with explicit type and consent', async () => {
  const response = await submit(await startHandler(), {
    ...validMeeting, date: undefined, time: undefined,
    preferredDate: validMeeting.date, preferredTime: validMeeting.time,
  })
  assert.equal(response.status, 200)
})

for (const [description, change] of [
  ['shell payload in name', { name: '$(curl attacker.invalid/probe)' }],
  ['template payload in name', { name: '{{7*7}} ${7*7}' }],
  ['header injection', { company: 'Acme\r\nBcc: attacker@example.com' }],
  ['Unicode line separator', { name: 'Alex\u2028Moreau' }],
  ['bidirectional subject spoofing', { company: 'Acme\u202Ecom' }],
  ['control characters in message', { message: 'A sufficiently long message with a null\u0000byte' }],
  ['invalid email', { email: 'not-an-email' }],
  ['email header injection', { email: 'alex@example.com\nBcc: attacker@example.com' }],
  ['missing consent', { consent: undefined }],
  ['non-boolean consent', { consent: 'true' }],
  ['missing type', { type: undefined }],
  ['nested field', { company: { constructor: 'probe' } }],
  ['unexpected destination', { to: 'attacker@example.com' }],
  ['prototype payload', { constructor: { prototype: { polluted: true } } }],
  ['filled honeypot', { bookingVerification: 'bot input' }],
  ['javascript product URL', { projectSlug: 'javascript:alert(1)' }],
  ['URL credentials', { projectSlug: 'https://user:password@example.com/' }],
  ['invalid timezone', { timezone: 'Unknown/Mars' }],
  ['unoffered meeting slot', { time: '03:00' }],
  ['coerced duration', { duration: [] }],
  ['conflicting meeting aliases', { preferredTime: '11:00' }],
  ['oversized name', { name: 'A'.repeat(121) }],
]) {
  test(`rejects ${description} before verification or delivery`, async () => {
    let verifications = 0, deliveries = 0
    const url = await startHandler({
      verifyBot: async () => { verifications += 1 },
      sendEmail: async () => { deliveries += 1; return { id: 'id' } },
    })
    const response = await submit(url, { ...validMeeting, ...change })
    assert.equal(response.status, 400)
    assert.equal(verifications, 0)
    assert.equal(deliveries, 0)
  })
}

test('keeps technical prose inert and HTML-escaped; never fetches submitted URLs', async () => {
  let delivered
  const message = 'Project details: $(curl attacker.invalid) {{7*7}} ${7*7} <img src=x onerror=alert(1)> https://attacker.invalid/probe'
  const result = await processBooking({ ...validProject, message }, {
    sendEmail: async (email) => { delivered = email; return { id: 'id' } },
  })
  assert.equal(result.success, true)
  assert.ok(delivered.text.includes(message))
  assert.ok(delivered.html.includes('&lt;img src=x onerror=alert(1)&gt;'))
  assert.ok(!delivered.html.includes('<img src=x'))
  assert.ok(delivered.html.includes('{{7*7}} ${7*7}'))
})

for (const [description, headers, status] of [
  ['missing origin', { Origin: '' }, 403],
  ['foreign origin', { Origin: 'https://attacker.invalid' }, 403],
  ['origin prefix lookalike', { Origin: 'https://hammerload.com.attacker.invalid' }, 403],
  ['cross-site fetch', { 'Sec-Fetch-Site': 'cross-site' }, 403],
  ['non-JSON content type', { 'Content-Type': 'text/plain' }, 415],
  ['JSON content type substring', { 'Content-Type': 'text/application/json' }, 415],
  ['compressed body', { 'Content-Encoding': 'gzip' }, 415],
]) {
  test(`rejects ${description}`, async () => {
    const response = await submit(await startHandler(), validMeeting, headers)
    assert.equal(response.status, status)
  })
}

test('spoofing forwarded IP headers cannot reset the five-attempt quota', async () => {
  const url = await startHandler()
  for (let i = 0; i < 5; i += 1) {
    const response = await submit(url, {}, { 'X-Forwarded-For': `203.0.113.${i}`, 'X-Real-IP': `203.0.113.${i}` })
    assert.equal(response.status, 400)
  }
  const response = await submit(url, {}, { 'X-Forwarded-For': '198.51.100.1', 'X-Real-IP': '198.51.100.1' })
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('retry-after'), '900')
})

test('IPv6 address rotation within a /64 cannot reset quotas through a trusted proxy', async () => {
  const url = await startHandler({ env: { BOOKING_TRUSTED_PROXIES: '127.0.0.1' } })
  for (let i = 1; i <= 6; i += 1) {
    const response = await submit(url, {}, { 'X-Real-IP': `2001:db8:abcd:1::${i}` })
    assert.equal(response.status, i <= 5 ? 400 : 429)
  }
})

test('email quota is atomic across concurrent requests from different verified IPs', async () => {
  let deliveries = 0
  const url = await startHandler({
    env: { BOOKING_TRUSTED_PROXIES: '127.0.0.1' },
    sendEmail: async () => { deliveries += 1; return { id: 'id' } },
  })
  const responses = await Promise.all(Array.from({ length: 6 }, (_, i) =>
    submit(url, validMeeting, { 'X-Real-IP': `203.0.113.${i + 1}` })))
  assert.equal(deliveries, 3)
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 200, 200, 429, 429, 429])
})

test('global delivery quota stops rotation of both IPs and email addresses', async () => {
  let deliveries = 0
  const url = await startHandler({
    env: { BOOKING_TRUSTED_PROXIES: '127.0.0.1' },
    sendEmail: async () => { deliveries += 1; return { id: 'id' } },
  })
  for (let i = 1; i <= 31; i += 1) {
    const response = await submit(url, { ...validMeeting, email: `alex${i}@example.com` }, { 'X-Real-IP': `203.0.113.${i}` })
    assert.equal(response.status, i <= 30 ? 200 : 429)
  }
  assert.equal(deliveries, 30)
})

test('invalid origins also consume the attempt quota', async () => {
  const url = await startHandler()
  for (let i = 0; i < 5; i += 1) assert.equal((await submit(url, validMeeting, { Origin: 'https://attacker.invalid' })).status, 403)
  assert.equal((await submit(url)).status, 429)
})

test('malformed JSON and oversized bodies never reach verification', async () => {
  const url = await startHandler({ verifyBot: () => assert.fail('Must not verify') })
  for (const [body, status] of [['{', 400], [' '.repeat(16 * 1024 + 1), 413]]) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN }, body })
    assert.equal(response.status, status)
  }
})

test('rejects chunked oversized bodies without waiting for the client to finish', async () => {
  const url = await startHandler({ bodyLimits: { maxBytes: 128, timeoutMs: 1000 } })
  const status = await new Promise((resolve, reject) => {
    const request = httpRequest(url, { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' } }, (response) => {
      response.resume()
      response.once('end', () => { request.destroy(); resolve(response.statusCode) })
    })
    request.on('error', reject)
    request.write('x'.repeat(256))
  })
  assert.equal(status, 413)
})

test('slow request bodies time out and close their connection', async () => {
  const url = await startHandler({ bodyLimits: { timeoutMs: 30 } })
  const status = await new Promise((resolve, reject) => {
    const request = httpRequest(url, { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' } }, (response) => {
      response.resume()
      response.once('end', () => { request.destroy(); resolve(response.statusCode) })
    })
    request.on('error', reject)
    request.write('{')
  })
  assert.equal(status, 408)
})

test('missing bot verification configuration fails closed', async () => {
  const url = await startHandler({ verifyBot: undefined })
  assert.equal((await submit(url)).status, 503)
})

test('invalid bot tokens stop the handler before any email is sent', async () => {
  let deliveries = 0
  const url = await startHandler({
    env: { TURNSTILE_SECRET_KEY: 'test-secret' },
    verifyBot: undefined,
    fetchImpl: async () => new Response(JSON.stringify({ success: false }), { status: 200 }),
    sendEmail: async () => { deliveries += 1; return { id: 'id' } },
  })
  assert.equal((await submit(url)).status, 403)
  assert.equal(deliveries, 0)
})

test('in-flight booking work is bounded and capacity is released after completion', async () => {
  let verifications = 0
  let release
  const gate = new Promise((resolve) => { release = resolve })
  const url = await startHandler({
    env: { BOOKING_TRUSTED_PROXIES: '127.0.0.1' },
    verifyBot: async () => { verifications += 1; await gate },
  })
  const pending = Array.from({ length: 8 }, (_, i) => submit(url, {
    ...validMeeting, email: `alex${i}@example.com`,
  }, { 'X-Real-IP': `203.0.113.${i + 1}` }))
  try {
    const deadline = Date.now() + 2000
    while (verifications < 8 && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 5))
    assert.equal(verifications, 8)
    assert.equal((await submit(url, validMeeting, { 'X-Real-IP': '198.51.100.1' })).status, 503)
  } finally {
    release()
    assert.ok((await Promise.all(pending)).every((response) => response.status === 200))
  }
  assert.equal((await submit(url, validMeeting, { 'X-Real-IP': '198.51.100.1' })).status, 200)
})

test('production refuses to silently use nonpersistent quotas', async () => {
  const url = await startHandler({ env: { NODE_ENV: 'production' } })
  assert.equal((await submit(url)).status, 503)
})

test('provider errors do not expose submitted text or provider diagnostics', async (t) => {
  const logs = []
  t.mock.method(console, 'error', (...args) => logs.push(JSON.stringify(args)))
  const url = await startHandler({ sendEmail: async () => { throw new Error('PRIVATE_DIAGNOSTICS Alex Moreau secret-key') } })
  const response = await submit(url)
  const body = await response.text()
  assert.equal(response.status, 503)
  assert.ok(!body.includes('PRIVATE_DIAGNOSTICS'))
  assert.ok(!logs.join('').includes('PRIVATE_DIAGNOSTICS'))
  assert.ok(!logs.join('').includes('Alex Moreau'))
  assert.ok(!logs.join('').includes('secret-key'))
})

test('Resend calls only its fixed API with a bounded timeout and fixed recipient', async (t) => {
  let calledUrl, calledOptions
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calledUrl = url; calledOptions = options
    return new Response(JSON.stringify({ id: 'id' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  })
  const result = await sendWithResend({ subject: 'Subject', text: 'Text', html: '<p>Text</p>', replyTo: 'alex@example.com', to: 'attacker@example.com' }, { RESEND_API_KEY: 'test-key' })
  assert.equal(result.id, 'id')
  assert.equal(calledUrl, 'https://api.resend.com/emails')
  assert.deepEqual(JSON.parse(calledOptions.body).to, ['contact@hammerload.com'])
  assert.equal(calledOptions.redirect, 'error')
  assert.ok(calledOptions.signal instanceof AbortSignal)
  assert.ok(calledOptions.headers.get('Idempotency-Key'))
})
