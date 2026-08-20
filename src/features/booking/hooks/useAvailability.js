import { useEffect, useState } from 'react'
import { fetchAvailability } from '../api/bookingApi'

/** Loads bookable days once the meeting branch is actually on screen. */
export function useAvailability(enabled = true, days = 10) {
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return undefined

    let cancelled = false
    setLoading(true)

    fetchAvailability(days)
      .then((data) => {
        if (!cancelled) setAvailability(data)
      })
      .catch((cause) => {
        if (!cancelled) setError(cause.message ?? 'Could not load availability.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, days])

  return { availability, loading, error }
}
