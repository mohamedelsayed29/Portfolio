const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "Tue, 26 Aug" — short, unambiguous, no year noise for near-term slots. */
export function formatDayLabel(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${DAY_LABELS[d.getDay()]}, ${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`
}

/** ISO yyyy-mm-dd, in local time (not UTC — avoids off-by-one-day booking bugs). */
export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatBudgetRange(range) {
  if (!range) return '—'
  if (range.max === null) return `${formatCurrency(range.min)}+`
  return `${formatCurrency(range.min)} – ${formatCurrency(range.max)}`
}

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
