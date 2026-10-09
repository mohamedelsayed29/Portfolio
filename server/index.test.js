import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, test } from 'node:test'
import { createPortfolioServer } from './index.js'

const servers = [], directories = []
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => { server.close(resolve); server.closeAllConnections() })))
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})
async function start(bookingOptions = { env: {} }) {
  const dir = await mkdtemp(join(tmpdir(), 'hammerload-static-'))
  directories.push(dir)
  const root = join(dir, 'dist')
  await mkdir(root)
  await writeFile(join(root, 'index.html'), '<html><script type="application/ld+json">{"name":"HammerLoad"}</script><body>Portfolio</body></html>')
  await writeFile(join(root, 'sitemap.xml'), '<urlset/>')
  await writeFile(join(root, 'robots.txt'), 'User-agent: *')
  await writeFile(join(dir, 'secret.txt'), 'SECRET_MUST_NOT_LEAK')
  await symlink(join(dir, 'secret.txt'), join(root, 'linked.txt'))
  await writeFile(join(root, '.env'), 'SECRET_MUST_NOT_LEAK')
  const server = createPortfolioServer({ rootDirectory: root, bookingOptions })
  servers.push(server)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return `http://127.0.0.1:${server.address().port}`
}

test('serves pages and permitted embeds with an enforced CSP and no inline script wildcard', async () => {
  const response = await fetch(await start())
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-cache')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('x-frame-options'), 'DENY')
  const policy = response.headers.get('content-security-policy')
  assert.match(policy, /script-src 'self'/)
  assert.match(policy, /sha256-/)
  assert.match(policy, /frame-ancestors 'none'/)
  assert.ok(!policy.includes('unsafe-eval'))
  assert.ok(policy.includes('https://www.youtube-nocookie.com'))
})

test('SPA routes, robots and sitemap continue working', async () => {
  const url = await start()
  for (const path of ['/ar/work', '/sitemap.xml', '/robots.txt']) assert.equal((await fetch(url + path)).status, 200)
})

test('rejects malformed paths, traversal, secret files and escaped symlinks without crashing', async () => {
  const url = await start()
  for (const [path, status] of [
    ['/%', 400], ['/%00', 400], ['/%5Csecret.txt', 400],
    ['/..%2Fsecret.txt', 404], ['/linked.txt', 404], ['/.env', 404],
    ['/assets/missing.js', 404], ['/assets/missing', 404],
  ]) {
    const response = await fetch(url + path)
    assert.equal(response.status, status, path)
    assert.ok(!(await response.text()).includes('SECRET_MUST_NOT_LEAK'))
  }
  assert.deepEqual(await (await fetch(url + '/health')).json(), { ok: true })
})

test('both booking routes are active and reject unsupported methods and missing origins', async () => {
  const url = await start()
  for (const path of ['/api/send-booking', '/api/bookings']) {
    const unsupported = await fetch(url + path)
    assert.equal(unsupported.status, 405)
    assert.equal(unsupported.headers.get('allow'), 'POST')
    assert.equal((await fetch(url + path, { method: 'POST' })).status, 403)
  }
  for (const method of ['GET', 'POST']) assert.equal((await fetch(url + '/api/unknown', { method })).status, 404)
})

test('switching between booking aliases cannot bypass the shared attempt quota', async () => {
  const url = await start()
  for (let i = 0; i < 5; i += 1) {
    const path = i % 2 ? '/api/bookings' : '/api/send-booking'
    assert.equal((await fetch(url + path, { method: 'POST' })).status, 403)
  }
  const response = await fetch(url + '/api/bookings', { method: 'POST' })
  assert.equal(response.status, 429)
  assert.ok(Number(response.headers.get('retry-after')) > 0)
})

test('the production server connects both booking aliases to validation, verification and delivery', async () => {
  let verifications = 0
  const emails = []
  const url = await start({
    env: {},
    verifyBot: async () => { verifications += 1 },
    sendEmail: async (email) => { emails.push(email); return { id: 'test-email' } },
  })
  for (const path of ['/api/send-booking', '/api/bookings']) {
    const response = await fetch(url + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://hammerload.com' },
      body: JSON.stringify({
        type: 'project', name: 'Alex Moreau', email: 'alex@example.com', consent: true,
        service: 'frontend', budget: 'under-5k', timeline: 'asap',
        message: 'We need a website for our growing business.', turnstileToken: 'test-token',
      }),
    })
    assert.equal(response.status, 200)
    const result = await response.json()
    assert.equal(result.success, true)
    assert.match(result.reference, /^HL-[A-F0-9]{8}$/)
  }
  assert.equal(verifications, 2)
  assert.equal(emails.length, 2)
  assert.ok(emails.every((email) => email.to === 'contact@hammerload.com'))
})
