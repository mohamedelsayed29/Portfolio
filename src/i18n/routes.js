export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGES = ['en', 'ar']
export const AR_PREFIX = '/ar'

export function languageFromPathname(pathname = '/') {
  return pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? 'ar' : DEFAULT_LANGUAGE
}

export function stripLanguagePrefix(pathname = '/') {
  if (pathname === AR_PREFIX) return '/'
  if (pathname.startsWith(`${AR_PREFIX}/`)) return pathname.slice(AR_PREFIX.length) || '/'
  return pathname || '/'
}

export function localizedPath(to = '/', language = DEFAULT_LANGUAGE) {
  if (!to || !to.startsWith('/')) return to

  const splitAt = [...to]
    .map((character, index) => (character === '?' || character === '#' ? index : -1))
    .find((index) => index >= 0)
  const pathname = splitAt === undefined ? to : to.slice(0, splitAt)
  const suffix = splitAt === undefined ? '' : to.slice(splitAt)
  const basePath = stripLanguagePrefix(pathname)

  if (language === 'ar') return `${basePath === '/' ? AR_PREFIX : `${AR_PREFIX}${basePath}`}${suffix}`
  return `${basePath === '/' ? '/' : basePath}${suffix}`
}
