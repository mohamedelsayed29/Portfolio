import { api, ApiError, delay, isBackendConfigured } from '@lib/api'
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

const label = (value = '') =>
  String(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export async function createBooking(payload) {
  const requestType = payload.type === 'meeting' ? 'Meeting' : label(payload.service || payload.type)
  const response = await fetch('/api/send-booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      requestType,
      preferredDate: payload.date,
      preferredTime: payload.time,
    }),
  })

  const text = await response.text()
  let body = null

  if (text) {
    try {
      body = JSON.parse(text)
    } catch (error) {
      console.error('Booking response JSON parse failed:', { text, error })
    }
  }

  console.log('Booking response:', {
    status: response.status,
    ok: response.ok,
    body,
  })

  if (!response.ok) {
    throw new ApiError(body?.message ?? `Request failed with ${response.status}`, {
      status: response.status,
      details: body?.details,
    })
  }

  if (body?.success === false) {
    throw new ApiError(body?.message ?? 'We could not send your request.', {
      status: response.status,
      details: body?.details,
    })
  }

  return body ?? { success: true, type: payload.type, email: payload.email }
}
