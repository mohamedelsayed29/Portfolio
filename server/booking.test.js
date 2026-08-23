import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { afterEach, test } from 'node:test'
import { createBookingRequestHandler } from './booking.js'

const servers = []

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))))
})

async function startHandler(options = {}) {
  const server = createServer(createBookingRequestHandler(options))
  servers.push(server)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  return `http://127.0.0.1:${address.port}/api/bookings`
}

const upcomingDate = new Date()
upcomingDate.setUTCDate(upcomingDate.getUTCDate() + 2)
const upcomingIsoDate = upcomingDate.toISOString().slice(0, 10)

const validMeeting = {
  type: 'meeting',
  name: 'Alex Moreau',
  email: 'alex@company.com',
  company: 'Acme Inc.',
  date: upcomingIsoDate,
  time: '10:00',
  duration: 30,
  message: 'We would like to discuss a product build.',
  timezone: 'Africa/Cairo',
  consent: true,
  website: '',
}

test('delivers a validated booking to the central recipient with customer reply-to', async () => {
  let delivered
  const url = await startHandler({
    env: {
      BOOKING_EMAIL: 'booking@hammerload.com',
      BOOKING_FROM_EMAIL: 'HammerLoad Website <website@hammerload.com>',
      RESEND_API_KEY: 'test-key',
    },
    sendEmail: async (message) => {
      delivered = message
      return { id: 'email-test-id' }
    },
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validMeeting),
  })
  const result = await response.json()

  assert.equal(response.status, 201)
  assert.match(result.reference, /^HL-[A-F0-9]{8}$/)
  assert.equal(delivered.to, 'booking@hammerload.com')
  assert.equal(delivered.replyTo, 'alex@company.com')
  assert.equal(delivered.subject, 'New HammerLoad booking - Alex Moreau / Acme Inc.')
  assert.match(delivered.text, new RegExp(`Preferred date:\\n${upcomingIsoDate}`))
})

test('rejects invalid input before attempting delivery', async () => {
  let attempts = 0
  const url = await startHandler({
    env: {},
    sendEmail: async () => {
      attempts += 1
    },
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...validMeeting, email: 'not-an-email' }),
  })
  const result = await response.json()

  assert.equal(response.status, 400)
  assert.equal(attempts, 0)
  assert.equal(result.details.email, 'Enter a valid email address.')
})

test('does not report success when email delivery is unavailable', async () => {
  const url = await startHandler({ env: {} })
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validMeeting),
  })
  const result = await response.json()

  assert.equal(response.status, 503)
  assert.match(result.message, /temporarily unavailable/i)
})

test('rejects the honeypot without sending an email', async () => {
  let attempts = 0
  const url = await startHandler({
    env: {},
    sendEmail: async () => {
      attempts += 1
    },
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...validMeeting, website: 'https://spam.invalid' }),
  })

  assert.equal(response.status, 400)
  assert.equal(attempts, 0)
})
