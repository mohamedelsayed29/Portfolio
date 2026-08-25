import { PATHS } from '@app/router/paths'

const lastUpdated = {
  iso: '2026-08-25',
  label: 'August 25, 2026',
}

/** Public company and policy metadata shared by legal pages, navigation and SEO. */
export const LEGAL = Object.freeze({
  companyName: 'Hammerload',
  contactEmail: 'social@hammerload.com',
  siteUrl: 'https://hammerload.com',
  privacyUrl: PATHS.privacy,
  termsUrl: PATHS.terms,
  dataDeletionUrl: PATHS.dataDeletion,
  lastUpdated,
})

export function legalCanonicalUrl(path) {
  return new URL(path, LEGAL.siteUrl).toString()
}
