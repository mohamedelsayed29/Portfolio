/** Central path table — import these instead of hardcoding route strings. */
export const PATHS = {
  home: '/',
  work: '/work',
  workDetail: (slug = ':slug') => `/work/${slug}`,
  services: '/services',
  about: '/about',
  book: '/book',
  privacy: '/privacy',
  terms: '/terms',
  dataDeletion: '/data-deletion',
  notFound: '*',
}
