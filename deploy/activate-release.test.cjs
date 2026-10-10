const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { test } = require('node:test')

const script = path.join(__dirname, 'activate-release.sh')

function fixture(t, previous = '1-old', overrides = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'hammerload-deploy-')))
  const app = path.join(root, 'app')
  const bin = path.join(root, 'bin')
  fs.mkdirSync(bin)
  fs.mkdirSync(path.join(app, 'shared'), { recursive: true })
  fs.writeFileSync(path.join(app, 'shared/.env.production'), 'RESEND_API_KEY=test-only\n')
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  function release(name) {
    const dir = path.join(app, 'releases', name)
    fs.mkdirSync(path.join(dir, 'dist'), { recursive: true })
    fs.mkdirSync(path.join(dir, 'server'))
    for (const file of ['dist/index.html', 'server/index.js', 'ecosystem.config.cjs']) {
      fs.writeFileSync(path.join(dir, file), 'fixture')
    }
    return dir
  }
  if (previous) fs.symlinkSync(release(previous), path.join(app, 'current'))
  release('2-new')

  function stub(name, source) {
    fs.writeFileSync(path.join(bin, name), `#!${process.execPath}\n${source}\n`, { mode: 0o755 })
  }
  stub('pm2', `
    const fs = require('node:fs'), path = require('node:path')
    const args = process.argv.slice(2), app = process.env.APP_DIR
    fs.appendFileSync(path.join(app, 'pm2-calls'), args.join(' ') + '\\n')
    if (args[0] === 'startOrReload') {
      const name = path.basename(path.dirname(args[1]))
      if (name === process.env.FAIL_PM2) process.exit(1)
      fs.writeFileSync(path.join(app, 'running'), name)
    }
    if (args[0] === 'save' && fs.existsSync(path.join(app, 'running')) &&
      fs.readFileSync(path.join(app, 'running'), 'utf8') === process.env.FAIL_SAVE) process.exit(1)
    if (args[0] === 'delete') fs.rmSync(path.join(app, 'running'), { force: true })
  `)
  stub('curl', `
    const fs = require('node:fs'), path = require('node:path')
    const running = fs.readFileSync(path.join(process.env.APP_DIR, 'running'), 'utf8')
    if (running === process.env.FAIL_HEALTH) process.exit(22)
    const release = running === process.env.WRONG_HEALTH ? 'stale-release' : running
    process.stdout.write(JSON.stringify({ ok: true, release }))
  `)
  // PM2/curl are simulated; adapt GNU filesystem commands for macOS test runs.
  if (process.platform !== 'linux') {
    stub('mv', `require('node:fs').renameSync(process.argv.at(-2), process.argv.at(-1))`)
    stub('readlink', `
      const fs = require('node:fs'), path = process.argv.at(-1)
      try { process.stdout.write(fs.realpathSync(path)) } catch { process.stdout.write(path) }
    `)
    stub('flock', `process.exit(process.env.FAIL_LOCK === '1' ? 1 : 0)`)
  }
  stub('sleep', '')
  const env = { ...process.env, PATH: `${bin}:${path.dirname(process.execPath)}:${process.env.PATH}`, APP_DIR: app, ...overrides }
  return {
    app, release,
    // Emulated Linux x64 can spend substantially longer launching the stubs.
    run: (name = '2-new', extra = {}) => spawnSync('bash', [script, name], { env: { ...env, ...extra }, encoding: 'utf8', timeout: 120000 }),
    current: () => fs.realpathSync(path.join(app, 'current')),
  }
}

test('activation switches to the expected release and saves PM2', t => {
  const f = fixture(t)
  const result = f.run()
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(f.current(), path.join(f.app, 'releases/2-new'))
  assert.equal(fs.statSync(path.join(f.app, 'shared/.env.production')).mode & 0o777, 0o600)
  assert.match(fs.readFileSync(path.join(f.app, 'pm2-calls'), 'utf8'), /save/)
})

for (const failure of ['FAIL_PM2', 'FAIL_HEALTH', 'WRONG_HEALTH', 'FAIL_SAVE']) {
  test(`${failure} restores and verifies the previous release`, t => {
    const f = fixture(t, '1-old', { [failure]: '2-new' })
    const result = f.run()
    assert.equal(result.status, 1, result.stdout + result.stderr)
    assert.match(result.stdout, /ROLLBACK_OK/)
    assert.equal(f.current(), path.join(f.app, 'releases/1-old'))
    assert.equal(fs.readFileSync(path.join(f.app, 'running'), 'utf8'), '1-old')
  })
}

test('first activation handles a missing current link', t => {
  const f = fixture(t, null)
  const result = f.run()
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(f.current(), path.join(f.app, 'releases/2-new'))
})

test('failed first deployment removes the new app and current link', t => {
  const f = fixture(t, null, { FAIL_HEALTH: '2-new' })
  const result = f.run()
  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(result.stdout, /FIRST_RELEASE_FAILED/)
  assert.equal(fs.existsSync(path.join(f.app, 'current')), false)
  assert.equal(fs.existsSync(path.join(f.app, 'running')), false)
})

test('failed rollback is explicitly reported', t => {
  const f = fixture(t, '1-old', { FAIL_HEALTH: '2-new', FAIL_PM2: '1-old' })
  const result = f.run()
  assert.equal(result.status, 1)
  assert.match(result.stderr, /ROLLBACK_FAILED/)
})

test('pruning protects an older live release and its previous target', t => {
  const f = fixture(t)
  for (const name of ['3-other', '4-other', '5-other', '6-other', '7-other']) f.release(name)
  const result = f.run('2-new', { KEEP_RELEASES: '3' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(fs.readdirSync(path.join(f.app, 'releases')).length, 3)
  assert.equal(fs.existsSync(path.join(f.app, 'releases/1-old')), true)
  assert.equal(fs.existsSync(path.join(f.app, 'releases/2-new')), true)
})

test('invalid release traversal is rejected before activation', t => {
  const f = fixture(t)
  const result = f.run('../shared')
  assert.equal(result.status, 1)
  assert.equal(f.current(), path.join(f.app, 'releases/1-old'))
})

test('incomplete release does not disturb the live release', t => {
  const f = fixture(t)
  fs.unlinkSync(path.join(f.app, 'releases/2-new/dist/index.html'))
  const result = f.run()
  assert.equal(result.status, 1)
  assert.equal(f.current(), path.join(f.app, 'releases/1-old'))
})

test('a release symlink outside releases is rejected', t => {
  const f = fixture(t)
  fs.rmSync(path.join(f.app, 'releases/2-new'), { recursive: true })
  fs.symlinkSync(path.join(f.app, 'shared'), path.join(f.app, 'releases/2-new'))
  assert.equal(f.run().status, 1)
  assert.equal(f.current(), path.join(f.app, 'releases/1-old'))
})

test('re-activating the current release does not delete it', t => {
  const f = fixture(t, '1-old')
  assert.equal(f.run('1-old').status, 1)
  assert.equal(f.current(), path.join(f.app, 'releases/1-old'))
})
