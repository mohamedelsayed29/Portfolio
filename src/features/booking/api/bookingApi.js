import { api, delay, isBackendConfigured, request } from '@lib/api'
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

export async function createBooking(payload) {
  // Booking delivery is always owned by this application. Availability may
  // still come from VITE_API_URL, but successful submissions cannot bypass the
  // same-origin endpoint that sends to HammerLoad's configured inbox.
  return request('/api/bookings', { method: 'POST', body: payload, baseUrl: '' })
}
