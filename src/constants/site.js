/**
 * User-facing text fields follow the site-wide i18n convention: `{ en, ar }`
 * objects, collapsed by `useLocalized()` / `localize()` from `@/i18n`.
 * Node-side consumers (scripts/prerender-seo.mjs) read the `.en` value.
 */
export const SITE = {
  name: 'HammerLoad',
  shortName: 'HammerLoad',
  url: 'https://hammerload.com',
  tagline: {
    en: 'Software development & AI solutions',
    ar: 'تطوير البرمجيات وحلول الذكاء الاصطناعي',
  },
  description: {
    en: 'We design, build and rescue software — web, mobile, backend and AI/LLM systems — for teams that care about the details.',
    ar: 'نصمّم البرمجيات ونبنيها وننقذها — أنظمة ويب وموبايل وأنظمة خلفية وذكاء اصطناعي — لفرقٍ تهتم بأدق التفاصيل.',
  },
  email: 'contact@hammerload.com',
  phone: '+1 (555) 010-4477',
  location: {
    en: 'Cairo, Egypt',
    ar: 'القاهرة، مصر',
  },
  bookingWindowDays: 14,
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/hammerload/' },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/hammerloadofficial?igsi=MXExc25rZmp5cnN3cQ==',
    },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593453309833' },
    { label: 'X', href: 'https://x.com/hammerload?s=11' },
  ],
}

export const STATS = [
  { value: '60+', label: { en: 'Products shipped', ar: 'منتجًا أطلقناه' } },
  { value: '1+', label: { en: 'Years building', ar: 'سنوات من الخبرة' } },
  { value: '24h', label: { en: 'Median first response', ar: 'متوسط زمن أول رد' } },
  { value: '98%', label: { en: 'Clients who return', ar: 'من العملاء يعودون إلينا' } },
]
