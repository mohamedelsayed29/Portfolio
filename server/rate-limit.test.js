import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, test } from 'node:test'
import { attemptPolicies, createRateLimiter, deliveryPolicies } from './rate-limit.js'

const directories = []
afterEach(async () => { await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))) })
async function temporary() {
  const dir = await mkdtemp(join(tmpdir(), 'hammerload-rates-'))
  directories.push(dir)
  return dir
}

test('sliding quotas return the remaining wait and expire at the exact boundary', async () => {
  let time = 1_000_000
  const limiter = createRateLimiter({ now: () => time })
  for (let i = 0; i < 5; i += 1) await limiter.consume(attemptPolicies('192.0.2.1'))
  time += 5000
  await assert.rejects(limiter.consume(attemptPolicies('192.0.2.1')), { status: 429, retryAfter: 895 })
  time += 895_000
  await limiter.consume(attemptPolicies('192.0.2.1'))
})

test('daily IP quota survives expiration of shorter windows', async () => {
  let time = 1_000_000
  const limiter = createRateLimiter({ now: () => time })
  for (let window = 0; window < 4; window += 1) {
    for (let i = 0; i < 5; i += 1) await limiter.consume(attemptPolicies('192.0.2.1'))
    time += 15 * 60_000
  }
  await assert.rejects(limiter.consume(attemptPolicies('192.0.2.1')), { status: 429 })
})

test('daily email quota survives hourly window expiration', async () => {
  let time = 1_000_000
  const limiter = createRateLimiter({ now: () => time })
  for (let i = 0; i < 3; i += 1) await limiter.consume(deliveryPolicies('alex@example.com'))
  time += 60 * 60_000
  for (let i = 0; i < 2; i += 1) await limiter.consume(deliveryPolicies('alex@example.com'))
  await assert.rejects(limiter.consume(deliveryPolicies('alex@example.com')), { status: 429 })
})

test('global attempt quotas stop IP rotation before growing unbounded state', async () => {
  const limiter = createRateLimiter()
  for (let i = 0; i < 120; i += 1) await limiter.consume(attemptPolicies(`192.0.2.${i}`))
  await assert.rejects(limiter.consume(attemptPolicies('198.51.100.1')), { status: 429 })
})

test('atomic reservations cannot overshoot a quota during concurrent requests', async () => {
  const limiter = createRateLimiter()
  const results = await Promise.allSettled(Array.from({ length: 30 }, () => limiter.consume(deliveryPolicies('alex@example.com'))))
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 3)
  for (const result of results.filter((result) => result.status === 'rejected')) assert.equal(result.reason.status, 429)
})

test('quotas survive restart without persisting raw IPs or emails', async () => {
  const stateFile = join(await temporary(), 'rates.json')
  const first = createRateLimiter({ stateFile })
  for (let i = 0; i < 5; i += 1) await first.consume(attemptPolicies('203.0.113.15'))
  await first.consume(deliveryPolicies('private-customer@example.com'))
  const second = createRateLimiter({ stateFile })
  await assert.rejects(second.consume(attemptPolicies('203.0.113.15')), { status: 429 })
  const data = await readFile(stateFile, 'utf8')
  assert.ok(!data.includes('203.0.113.15'))
  assert.ok(!data.includes('private-customer@example.com'))
})

test('unwritable or corrupt quota storage fails closed', async () => {
  const dir = await temporary()
  const parent = join(dir, 'not-a-directory')
  await writeFile(parent, 'file')
  await assert.rejects(createRateLimiter({ stateFile: join(parent, 'rates.json') }).consume(attemptPolicies('192.0.2.1')), { status: 503 })
  const corrupted = join(dir, 'corrupted.json')
  await writeFile(corrupted, '{ invalid JSON')
  await assert.rejects(createRateLimiter({ stateFile: corrupted }).consume(attemptPolicies('192.0.2.1')), { status: 503 })
  assert.equal(await readFile(corrupted, 'utf8'), '{ invalid JSON')
})

test('full state rejects new identities instead of evicting active quotas', async () => {
  let time = 1_000_000
  const limiter = createRateLimiter({ maxEntries: 1, now: () => time })
  await limiter.consume([{ key: 'a', max: 1, window: 1000 }])
  await assert.rejects(limiter.consume([{ key: 'b', max: 1, window: 1000 }]), { status: 503 })
  await assert.rejects(limiter.consume([{ key: 'a', max: 1, window: 1000 }]), { status: 429 })
  time += 1000
  await limiter.consume([{ key: 'b', max: 1, window: 1000 }])
})
