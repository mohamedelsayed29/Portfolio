import { useEffect, useState } from 'react'
import { localize, useLanguage } from '@/i18n'
import { fetchAvailability } from '../api/bookingApi'

const LOAD_FAILED = {
  en: 'Could not load availability.',
  ar: 'تعذّر تحميل المواعيد المتاحة.',
}

/** Loads bookable days once the meeting branch is actually on screen. */
export function useAvailability(enabled = true, days = 10) {
  const { language } = useLanguage()
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(enabled)
  // `{ en, ar }` locale object; collapsed on the way out so a language switch
  // re-renders an already-visible error in the new language.
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
        // A specific backend message is English-only: show it in English mode,
        // keep the generic Arabic line rather than mixing languages.
        if (!cancelled) {
          setError({ en: cause.message || LOAD_FAILED.en, ar: LOAD_FAILED.ar })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, days])

  return { availability, loading, error: localize(error, language) }
}
