import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@hooks'
import { localize } from './localize'

const STORAGE_KEY = 'portfolio:language'
export const LANGUAGES = ['en', 'ar']

const LanguageContext = createContext(null)

/** First visit only: follow the browser; every visit after that, the stored choice. */
const browserDefault = () => (navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en')

/**
 * Two-state language: 'en' | 'ar'. The choice is written to <html lang dir>,
 * which drives the RTL flow, the Arabic font stack and the letter-spacing
 * reset in index.css — components only ever read the context.
 */
export function LanguageProvider({ children }) {
  const [stored, setLanguage] = useLocalStorage(STORAGE_KEY, browserDefault())
  const language = LANGUAGES.includes(stored) ? stored : 'en'
  const isRTL = language === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'ar' ? 'en' : 'ar'))
  }, [setLanguage])

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

/** For component-local UI strings: `const s = useStrings({ en: {…}, ar: {…} })`. */
export function useStrings(strings) {
  const { language } = useLanguage()
  return strings[language] ?? strings.en
}
