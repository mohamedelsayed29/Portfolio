const DAY_LABELS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
}

/* Latin digits in both languages — Arabic copy on the site keeps 0-9 so prices,
   dates and phone numbers read the same everywhere. */
const NUMBER_LOCALES = { en: 'en-US', ar: 'ar-EG-u-nu-latn' }

/** "Tue, 26 Aug" / "الثلاثاء، 26 أغسطس" — short, unambiguous, no year noise. */
export function formatDayLabel(date, lang = 'en') {
  const d = date instanceof Date ? date : new Date(date)
  const labels = DAY_LABELS[lang] ?? DAY_LABELS.en
  const month = d.toLocaleString(NUMBER_LOCALES[lang] ?? NUMBER_LOCALES.en, { month: 'short' })
  return `${labels[d.getDay()]}${lang === 'ar' ? '،' : ','} ${d.getDate()} ${month}`
}

/** ISO yyyy-mm-dd, in local time (not UTC — avoids off-by-one-day booking bugs). */
export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function formatCurrency(amount, currency = 'USD', lang = 'en') {
  return new Intl.NumberFormat(NUMBER_LOCALES[lang] ?? NUMBER_LOCALES.en, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatBudgetRange(range, lang = 'en') {
  if (!range) return '—'
  if (range.max === null) return `${formatCurrency(range.min, 'USD', lang)}+`
  return `${formatCurrency(range.min, 'USD', lang)} – ${formatCurrency(range.max, 'USD', lang)}`
}

/** English-only; Arabic callers should use explicit localized strings instead. */
export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
