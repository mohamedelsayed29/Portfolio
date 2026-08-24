import { LoaderCircle } from 'lucide-react'
import { useStrings } from '@/i18n'
import { cn } from '@lib/cn'

const STRINGS = {
  en: { loading: 'Loading' },
  ar: { loading: 'جارٍ التحميل' },
}

export function Spinner({ size = 20, className, label }) {
  const s = useStrings(STRINGS)

  return (
    <span
      role="status"
      aria-label={label ?? s.loading}
      className={cn('inline-flex text-text-subtle', className)}
    >
      <LoaderCircle size={size} className="animate-spin" aria-hidden="true" />
    </span>
  )
}
