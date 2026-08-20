import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '@hooks'

const STORAGE_KEY = 'portfolio:theme'
const ThemeContext = createContext(null)

const systemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/**
 * Three-state theme: 'light' | 'dark' | 'system'. Only the resolved value is
 * written to <html data-theme>, which is what the CSS custom-variant keys off.
 *
 * The resolved value is held in state rather than derived during render, so
 * consumers that colour themselves in JS (brand logos, for one) re-render when
 * the OS flips appearance while the preference is still 'system'.
 */
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useLocalStorage(STORAGE_KEY, 'system')
  const [resolved, setResolved] = useState(() =>
    preference === 'system' ? systemTheme() : preference,
  )

  useEffect(() => {
    const apply = () => {
      const next = preference === 'system' ? systemTheme() : preference
      document.documentElement.dataset.theme = next
      setResolved(next)
    }

    apply()

    if (preference !== 'system') return undefined

    // Follow the OS for as long as the user has not made an explicit choice.
    const list = window.matchMedia('(prefers-color-scheme: dark)')
    list.addEventListener('change', apply)
    return () => list.removeEventListener('change', apply)
  }, [preference])

  const toggleTheme = useCallback(() => {
    setPreference((current) => {
      const active = current === 'system' ? systemTheme() : current
      return active === 'dark' ? 'light' : 'dark'
    })
  }, [setPreference])

  const value = useMemo(
    () => ({ preference, theme: resolved, setTheme: setPreference, toggleTheme }),
    [preference, resolved, setPreference, toggleTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
