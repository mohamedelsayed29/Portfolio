import { api, delay, isBackendConfigured } from '@lib/api'
import { MEETING_SLOTS } from '@data/booking'
import { toISODate } from '@lib/format'

/**
 * Deterministic pseudo-availability. A real backend replaces this the moment
 * VITE_API_URL is set — the shape of what comes back is identical.
 */
const isSlotOpen = (isoDate, time) => {
  const seed = [...`${isoDate}${time}`].reduce((total, char) => total + char.charCodeAt(0), 0)
  return seed % 5 !== 0
}

const buildMockAvailability = (days) => {
  const today = new Date()
  const result = []

  for (let offset = 1; result.length < days; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)

    // Studio does not take calls at the weekend.
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const iso = toISODate(date)
    result.push({
      iso,
      date: date.toISOString(),
      slots: MEETING_SLOTS.map((time) => ({ time, available: isSlotOpen(iso, time) })),
    })
  }

  return result
}

export async function fetchAvailability(days = 10) {
  if (isBackendConfigured) {
    return api.get(`/availability?days=${days}`)
  }

  await delay(500)
  return buildMockAvailability(days)
}

const makeReference = (isoDate, email) => {
  const seed = [...`${isoDate}${email}`].reduce((total, char) => total + char.charCodeAt(0), 0)
  return `QW-${String(seed % 100000).padStart(5, '0')}`
}

export async function createBooking(payload) {
  if (isBackendConfigured) {
    return api.post('/bookings', payload)
  }

  await delay(1200)

  // Mock rejection path so the error state is reachable in the demo.
  if (payload.email.endsWith('@example.com')) {
    throw new Error('That address is a placeholder domain — use a reachable inbox.')
  }

  return {
    reference: makeReference(payload.date || toISODate(new Date()), payload.email),
    receivedAt: new Date().toISOString(),
    ...payload,
  }
}
