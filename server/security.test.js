import assert from 'node:assert/strict'
import { test } from 'node:test'
import { allowedOrigins, createClientIpResolver, ipRateKey, normalizeIp, verifyTurnstile } from './security.js'

const request = (peer, headers = {}) => ({ socket: { remoteAddress: peer }, headers })

test('canonicalizes equivalent IPv4/IPv6 identities and groups IPv6 /64s', () => {
  assert.equal(normalizeIp('::ffff:192.0.2.1'), '192.0.2.1')
  assert.equal(normalizeIp('2001:0db8::1'), normalizeIp('2001:db8:0:0:0:0:0:1'))
  assert.equal(ipRateKey('2001:db8::1'), ipRateKey('2001:db8::ffff'))
  assert.notEqual(ipRateKey('2001:db8:0:1::1'), ipRateKey('2001:db8:0:2::1'))
  assert.equal(normalizeIp('fe80::1%eth0'), null)
})

test('trusts X-Real-IP only from explicit trusted TCP peers', () => {
  const resolve = createClientIpResolver('172.30.0.1,127.0.0.1/32')
  assert.equal(resolve(request('203.0.113.1', { 'x-real-ip': '198.51.100.1', 'x-forwarded-for': '1.1.1.1' })), '203.0.113.1')
  assert.equal(resolve(request('172.30.0.1', { 'x-real-ip': '198.51.100.1', 'x-forwarded-for': '1.1.1.1' })), '198.51.100.1')
  assert.throws(() => resolve(request('172.30.0.1', { 'x-real-ip': '1.1.1.1,2.2.2.2' })), { status: 403 })
  assert.throws(() => resolve(request('172.30.0.1')), { status: 403 })
  assert.throws(() => createClientIpResolver('0.0.0.0/0'))
})

test('does not derive allowed origins from caller-supplied Host or forwarded headers', () => {
  assert.deepEqual([...allowedOrigins({})], ['https://hammerload.com', 'https://www.hammerload.com'])
  assert.throws(() => allowedOrigins({ BOOKING_ALLOWED_ORIGINS: 'https://hammerload.com/path' }))
  assert.throws(() => allowedOrigins({ NODE_ENV: 'production', BOOKING_ALLOWED_ORIGINS: 'http://hammerload.com' }))
})

const origins = new Set(['https://hammerload.com'])
const env = { TURNSTILE_SECRET_KEY: 'private-test-secret' }
const valid = () => ({ success: true, hostname: 'hammerload.com', action: 'booking', challenge_ts: new Date().toISOString() })
const responseFor = (result) => async () => new Response(JSON.stringify(result), { status: 200 })

test('verifies Turnstile at the fixed destination with a timeout, action and hostname', async () => {
  let calledUrl, calledOptions
  await verifyTurnstile('token', '203.0.113.1', {
    env, origins, fetchImpl: async (url, options) => {
      calledUrl = url; calledOptions = options
      return new Response(JSON.stringify(valid()), { status: 200 })
    },
  })
  assert.equal(calledUrl, 'https://challenges.cloudflare.com/turnstile/v0/siteverify')
  assert.equal(calledOptions.redirect, 'error')
  assert.ok(calledOptions.signal instanceof AbortSignal)
  assert.deepEqual(JSON.parse(calledOptions.body), { secret: env.TURNSTILE_SECRET_KEY, response: 'token', remoteip: '203.0.113.1' })
})

for (const [description, result] of [
  ['forged/replayed token', { success: false }],
  ['wrong action', { ...valid(), action: 'login' }],
  ['wrong hostname', { ...valid(), hostname: 'attacker.invalid' }],
  ['expired token', { ...valid(), challenge_ts: new Date(Date.now() - 301_000).toISOString() }],
  ['future timestamp', { ...valid(), challenge_ts: new Date(Date.now() + 60_000).toISOString() }],
]) {
  test(`rejects Turnstile ${description}`, async () => {
    await assert.rejects(verifyTurnstile('token', '203.0.113.1', { env, origins, fetchImpl: responseFor(result) }), { status: 403 })
  })
}

test('missing/oversized tokens are rejected without calling any provider', async () => {
  for (const token of ['', undefined, 'x'.repeat(2049)]) {
    await assert.rejects(verifyTurnstile(token, '203.0.113.1', { env, origins, fetchImpl: () => assert.fail('Must not fetch') }), { status: 403 })
  }
})

test('missing keys, provider outages and malformed responses fail closed', async () => {
  await assert.rejects(verifyTurnstile('token', '203.0.113.1', { env: {}, origins }), { status: 503 })
  for (const fetchImpl of [
    async () => { throw new Error('secret diagnostics') },
    async () => new Response('', { status: 500 }),
    async () => new Response('not-json', { status: 200 }),
  ]) {
    await assert.rejects(verifyTurnstile('token', '203.0.113.1', { env, origins, fetchImpl }), { status: 503 })
  }
})
