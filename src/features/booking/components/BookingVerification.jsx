import { useEffect, useRef, useState } from 'react'
import { useLanguage, useStrings } from '@/i18n'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('Verification unavailable'))
      script.onerror = () => {
        script.remove()
        scriptPromise = undefined
        reject(new Error('Verification unavailable'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

const STRINGS = {
  en: { unavailable: 'The security check is unavailable. Please email us instead.' },
  ar: { unavailable: 'تعذّر تحميل التحقق الأمني. يُرجى التواصل معنا عبر البريد الإلكتروني.' },
}

export function BookingVerification({ onChange, revision }) {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const { language } = useLanguage()
  const s = useStrings(STRINGS)
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  useEffect(() => {
    let cancelled = false
    let widgetId
    onChange('')
    if (!sitekey) return undefined
    loadTurnstile().then((turnstile) => {
      if (cancelled) return
      setFailed(false)
      widgetId = turnstile.render(containerRef.current, {
        sitekey,
        action: 'booking',
        language,
        theme: 'auto',
        'response-field': false,
        callback: (token) => { if (!cancelled) onChange(token) },
        'expired-callback': () => { if (!cancelled) onChange('') },
        'error-callback': () => {
          if (!cancelled) { onChange(''); setFailed(true) }
        },
      })
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => {
      cancelled = true
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [language, onChange, revision, sitekey])

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} />
      {(!sitekey || failed) && <p role="alert" className="text-[14px] text-danger">{s.unavailable}</p>}
    </div>
  )
}
