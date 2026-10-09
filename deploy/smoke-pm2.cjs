// Run after build/prune: npm exec --package=pm2@7.0.4 -- node deploy/smoke-pm2.cjs
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { createServer } = require('node:net')
const { once } = require('node:events')

async function main() {
  // Keep Unix socket paths short, including when macOS TMPDIR is very long.
  const root = fs.realpathSync(fs.mkdtempSync('/tmp/hammerload-smoke-'))
  const app = path.join(root, 'app')
  const source = path.resolve(__dirname, '..')
  const probe = createServer()
  probe.listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  const env = { ...process.env, APP_DIR: app, PORT: String(port), PM2_HOME: path.join(root, 'pm2-home') }
  // Do not reuse a keep-alive connection owned by a process that PM2 replaced.
  const request = (route, options = {}) => fetch(`http://127.0.0.1:${port}${route}`, {
    ...options, headers: { ...options.headers, Connection: 'close' }, signal: AbortSignal.timeout(5000),
  })
  const run = (cmd, args, cwd = root) => spawnSync(cmd, args, { cwd, env, encoding: 'utf8', timeout: 60000 })
  let failure
  try {
    fs.mkdirSync(path.join(app, 'shared'), { recursive: true })
    fs.writeFileSync(path.join(app, 'shared/.env.production'), 'RESEND_API_KEY=\nBOOKING_ALLOWED_ORIGINS=https://hammerload.com\n', { mode: 0o600 })
    const archive = path.join(root, 'release.tgz')
    const packed = run('tar', ['-czf', archive, 'dist', 'server', 'node_modules', 'package.json', 'package-lock.json', 'ecosystem.config.cjs', 'deploy/activate-release.sh'], source)
    assert.equal(packed.status, 0, packed.stderr)
    for (const name of ['1-good', '2-good', '3-broken']) {
      const dir = path.join(app, 'releases', name)
      fs.mkdirSync(dir, { recursive: true })
      assert.equal(run('tar', ['-xzf', archive, '-C', dir]).status, 0)
    }
    fs.writeFileSync(path.join(app, 'releases/3-broken/server/index.js'), 'throw new Error("intentional deployment test failure")\n')
    const activate = name => run('bash', [path.join(source, 'deploy/activate-release.sh'), name])
    const stateFile = path.join(app, 'shared/booking-security/quotas.json')
    let savedQuota
    for (const name of ['1-good', '2-good']) {
      const result = activate(name)
      assert.equal(result.status, 0, result.stdout + result.stderr)
      assert.deepEqual(await (await request('/health')).json(), { ok: true, release: name })
      if (savedQuota) assert.equal(fs.readFileSync(stateFile, 'utf8'), savedQuota)
      const rejected = await request('/api/send-booking', {
        method: 'POST', headers: { 'X-Real-IP': '192.0.2.1' },
      })
      assert.equal(rejected.status, 403)
      savedQuota = fs.readFileSync(stateFile, 'utf8')
      assert.equal(fs.statSync(stateFile).mode & 0o777, 0o600)
      console.log(`REAL_PM2_ACTIVATION_OK ${name}`)
    }
    const homepage = await request('/')
    assert.equal(homepage.status, 200)
    const asset = (await homepage.text()).match(/(?:src|href)="(\/assets\/[^" ]+)"/)[1]
    assert.equal((await request(asset)).status, 200)
    const invalid = await request('/api/send-booking', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Real-IP': '192.0.2.1' }, body: '{}',
    })
    assert.equal(invalid.status, 403)
    savedQuota = fs.readFileSync(stateFile, 'utf8')
    const broken = activate('3-broken')
    assert.equal(broken.status, 1, broken.stdout + broken.stderr)
    assert.match(broken.stdout, /ROLLBACK_OK/)
    assert.equal(fs.realpathSync(path.join(app, 'current')), path.join(app, 'releases/2-good'))
    assert.deepEqual(await (await request('/health')).json(), { ok: true, release: '2-good' })
    assert.equal(fs.readFileSync(stateFile, 'utf8'), savedQuota)
    const appProcess = JSON.parse(run('pm2', ['jlist']).stdout).find(entry => entry.name === 'hammerload')
    assert.equal(appProcess.pm2_env.status, 'online')
    assert.equal(appProcess.pm2_env.pm_exec_path, path.join(app, 'current/server/index.js'))
    console.log('REAL_PM2_ROLLBACK_OK; HOMEPAGE_ASSET_AND_INVALID_BOOKING_OK')
  } catch (error) {
    failure = error
  } finally {
    // PM2_HOME is unique to this test; never touch the user's normal PM2 daemon.
    run('pm2', ['delete', 'all'])
    const stopped = run('pm2', ['kill'])
    if (stopped.status === 0) fs.rmSync(root, { recursive: true, force: true })
    else {
      console.error(`Failed to stop isolated PM2; inspect ${root}`)
      failure ||= new Error('PM2 cleanup failed')
    }
  }
  if (failure) throw failure
}
main().catch(error => { console.error(error); process.exitCode = 1 })
