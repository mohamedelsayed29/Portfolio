import { LoaderCircle } from 'lucide-react'
import { cn } from '@lib/cn'

export function Spinner({ size = 20, className, label = 'Loading' }) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex text-text-subtle', className)}>
      <LoaderCircle size={size} className="animate-spin" aria-hidden="true" />
    </span>
  )
}
