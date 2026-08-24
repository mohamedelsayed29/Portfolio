import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '@hooks'
import { localize } from './localize'
import { LANGUAGES, languageFromPathname, localizedPath } from './routes'

const STORAGE_KEY = 'portfolio:language'

const LanguageContext = createContext(null)

/** First visit only: follow the browser; every visit after that, the stored choice. */
const browserDefault = () => (navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en')

/**
 * Two-state language: 'en' | 'ar'. The choice is written to <html lang dir>,
 * which drives the RTL flow, the Arabic font stack and the letter-spacing
 * reset in index.css — components only ever read the context.
 */
export function LanguageProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [, storeLanguage] = useLocalStorage(STORAGE_KEY, browserDefault())
  const language = languageFromPathname(location.pathname)
  const isRTL = language === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const setLanguage = useCallback(
    (nextLanguage) => {
      const normalized = LANGUAGES.includes(nextLanguage) ? nextLanguage : 'en'
      storeLanguage(normalized)
      navigate(localizedPath(`${location.pathname}${location.search}${location.hash}`, normalized))
    },
    [location.hash, location.pathname, location.search, navigate, storeLanguage],
  )

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }, [language, setLanguage])

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, isRTL, dir }),
    [language, setLanguage, toggleLanguage, isRTL, dir],
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}

/** Deep-localizes a data structure ({ en, ar } fields collapse to the active language). */
export function useLocalized(value) {
  const { language } = useLanguage()
  return useMemo(() => localize(value, language), [value, language])
}

export function useLocalizedPath(to) {
  const { language } = useLanguage()
  return useMemo(() => localizedPath(to, language), [language, to])
}

/** For component-local UI strings: `const s = useStrings({ en: {…}, ar: {…} })`. */
export function useStrings(strings) {
  const { language } = useLanguage()
  return strings[language] ?? strings.en
}
