import { Link } from 'react-router-dom'
import { SITE } from '@constants/site'
import { cn } from '@lib/cn'

export function Logo({ className, onClick, onDark = false }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${SITE.name} home`}
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'relative grid size-8 place-items-center overflow-hidden rounded-[10px]',
          onDark ? 'bg-white' : 'bg-text',
        )}
      >
        <span className={cn('text-[15px] font-semibold', onDark ? 'text-[#0a0a0c]' : 'text-bg')}>
          E
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/20 to-transparent transition-transform duration-700 ease-[var(--ease-apple)] group-hover:translate-x-full" />
      </span>
      <span
        className={cn(
          'text-[17px] font-semibold tracking-[-0.02em]',
          onDark && 'text-white',
        )}
      >
        {SITE.shortName}
      </span>
    </Link>
  )
}
