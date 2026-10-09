import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { cpSync, mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

async function startRuntime(t, extraEnv = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'hammerload-runtime-'))
  const probe = createServer()
  probe.listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  cpSync(fileURLToPath(new URL('.', import.meta.url)), join(dir, 'server'), { recursive: true })
  symlinkSync(fileURLToPath(new URL('../node_modules', import.meta.url)), join(dir, 'node_modules'))
  mkdirSync(join(dir, 'dist'))
  writeFileSync(join(dir, 'dist/index.html'), '<html>HammerLoad fixture</html>')
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}')
  writeFileSync(join(dir, '.env.production'), `PORT=${port}\nHOST=127.0.0.1\nHAMMERLOAD_RELEASE="runtime-test" # deployment identity\n`)
  const env = { ...process.env, NODE_ENV: 'test', ...extraEnv }
  delete env.PORT
  delete env.HOST
  if (!Object.hasOwn(extraEnv, 'HAMMERLOAD_RELEASE')) delete env.HAMMERLOAD_RELEASE
  const child = spawn(process.execPath, ['server/index.js'], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  child.stdout.on('data', data => { output += data })
  child.stderr.on('data', data => { output += data })
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit')
      child.kill('SIGTERM')
      await exited
    }
    rmSync(dir, { recursive: true, force: true })
  })
  const base = `http://127.0.0.1:${port}`
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(output)
    try {
      const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(100) })
      if (response.ok) return { base, child, dir }
    } catch { /* Wait for the child to bind its socket. */ }
    await new Promise(resolve => setTimeout(resolve, 30))
  }
  throw new Error(`Server failed to start: ${output}`)
}

test('runtime loads production port and standard dotenv syntax before listening', async t => {
  const { base } = await startRuntime(t)
  const response = await fetch(`${base}/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true, release: 'runtime-test' })
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.match(await (await fetch(base)).text(), /HammerLoad fixture/)
})

test('inherited environment takes precedence over production dotenv', async t => {
  const { base } = await startRuntime(t, { HAMMERLOAD_RELEASE: 'pm2-release' })
  assert.equal((await (await fetch(`${base}/health`)).json()).release, 'pm2-release')
})

test('production health identifies the executing release, not an inherited label', async t => {
  const { base, dir } = await startRuntime(t, { NODE_ENV: 'production', HAMMERLOAD_RELEASE: 'stale-label' })
  assert.equal((await (await fetch(`${base}/health`)).json()).release, dir.split('/').at(-1))
})

test('SIGTERM drains and exits successfully for PM2 reload', async t => {
  const { child } = await startRuntime(t)
  const exited = once(child, 'exit')
  child.kill('SIGTERM')
  const [code, signal] = await exited
  assert.equal(code, 0)
  assert.equal(signal, null)
})
