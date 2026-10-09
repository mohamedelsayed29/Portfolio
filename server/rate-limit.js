import { createHash, randomBytes } from 'node:crypto'
import { mkdir, open, rename, unlink } from 'node:fs/promises'
import { dirname } from 'node:path'
import { PublicError, unavailable } from './security.js'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MAX_ENTRIES = 10_000
const MAX_STATE_BYTES = 2 * 1024 * 1024
const digest = (value) => createHash('sha256').update(value).digest('hex')

export const attemptPolicies = (ip) => [
  { key: 'attempt:global:minute', max: 120, window: MINUTE },
  { key: 'attempt:global:hour', max: 1000, window: HOUR },
  { key: `attempt:ip:quarter:${ip}`, max: 5, window: 15 * MINUTE },
  { key: `attempt:ip:day:${ip}`, max: 20, window: DAY },
]

export const deliveryPolicies = (email) => [
  { key: 'delivery:global:hour', max: 30, window: HOUR },
  { key: 'delivery:global:day', max: 100, window: DAY },
  { key: `delivery:email:hour:${email}`, max: 3, window: HOUR },
  { key: `delivery:email:day:${email}`, max: 5, window: DAY },
]

/** One process owns the store. Docker mounts it across restarts. Requests are
 * serialized and commits are atomic; storage failures reject requests rather
 * than silently falling back to an empty quota. Use Redis for multiple workers.
 */
export function createRateLimiter({ stateFile, now = Date.now, maxEntries = MAX_ENTRIES } = {}) {
  let entries = new Map()
  let loaded = false
  let tail = Promise.resolve()

  async function load() {
    if (loaded) return
    if (stateFile) {
      try {
        const handle = await open(stateFile, 'r')
        let data
        try {
          if ((await handle.stat()).size > MAX_STATE_BYTES) throw unavailable()
          data = JSON.parse(await handle.readFile('utf8'))
        } finally {
          await handle.close()
        }
        if (data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > maxEntries) throw unavailable()
        for (const entry of data.entries) {
          if (!Array.isArray(entry) || entry.length !== 2) throw unavailable()
          const [key, value] = entry
          if (!/^[a-f0-9]{64}$/.test(key) || !value || !Number.isFinite(value.expires) ||
              !Array.isArray(value.hits) || value.hits.length > 1000 ||
              value.hits.some((hit, i) => !Number.isFinite(hit) || (i > 0 && hit < value.hits[i - 1]))) throw unavailable()
        }
        entries = new Map(data.entries)
      } catch (error) {
        if (error.code !== 'ENOENT') throw unavailable()
      }
    }
    loaded = true
  }

  async function persist(next) {
    if (!stateFile) return
    const temporary = `${stateFile}.${randomBytes(8).toString('hex')}.tmp`
    try {
      await mkdir(dirname(stateFile), { recursive: true, mode: 0o700 })
      const handle = await open(temporary, 'wx', 0o600)
      try {
        const data = JSON.stringify({ version: 1, entries: [...next] })
        if (Buffer.byteLength(data) > MAX_STATE_BYTES) throw unavailable()
        await handle.writeFile(data)
        await handle.sync()
      } finally {
        await handle.close()
      }
      await rename(temporary, stateFile)
    } catch {
      await unlink(temporary).catch(() => {})
      throw unavailable()
    }
  }

  return {
    consume(policies) {
      const operation = tail.then(async () => {
        await load()
        const time = now()
        for (const [key, value] of entries) if (value.expires <= time) entries.delete(key)
        const pending = policies.map((policy) => {
          const key = digest(policy.key)
          const hits = (entries.get(key)?.hits || []).filter((hit) => hit > time - policy.window)
          return { ...policy, key, hits }
        })
        const blocked = pending.filter((policy) => policy.hits.length >= policy.max)
        if (blocked.length) {
          const retryAfter = Math.max(...blocked.map((policy) => Math.ceil((policy.hits[0] + policy.window - time) / 1000)))
          throw new PublicError('Too many booking attempts. Please wait before trying again.', 429, undefined, Math.max(1, retryAfter))
        }
        const next = new Map(entries)
        for (const policy of pending) next.set(policy.key, { expires: time + policy.window, hits: [...policy.hits, time] })
        if (next.size > maxEntries) throw unavailable()
        await persist(next)
        entries = next
      })
      tail = operation.catch(() => {})
      return operation
    },
  }
}
