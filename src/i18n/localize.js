const LOCALE_KEYS = ['en', 'ar']

/**
 * A "locale object" is the translation convention used across data files:
 * any user-facing text field holds `{ en: '…', ar: '…' }` instead of a string.
 * Structural fields (ids, slugs, urls, colours, numbers) stay untouched.
 */
export const isLocaleObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  'en' in value &&
  Object.keys(value).every((key) => LOCALE_KEYS.includes(key))

/**
 * Deep-walks any data structure and collapses every locale object to the
 * requested language (falling back to English). React elements pass through
 * untouched so JSX embedded in data is never mangled.
 */
export function localize(value, lang) {
  if (value === null || typeof value !== 'object') return value
  if (value.$$typeof) return value
  if (Array.isArray(value)) return value.map((item) => localize(item, lang))
  if (isLocaleObject(value)) return localize(value[lang] ?? value.en, lang)
  const out = {}
  for (const key of Object.keys(value)) out[key] = localize(value[key], lang)
  return out
}
