import { Link } from 'react-router-dom'
import { SITE } from '@constants/site'
import { cn } from '@lib/cn'

export function Logo({ className, onClick, onDark = false }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${SITE.name} home`}
      className={cn('group inline-flex items-center py-1', className)}
    >
      <span
        className={cn(
          'relative text-[19px] font-semibold tracking-normal sm:text-[20px]',
          'transition-colors duration-300 ease-[var(--ease-apple)]',
          onDark ? 'text-white' : 'text-text',
        )}
      >
        <span>Hammer</span>
        <span className={cn(onDark ? 'text-white/72' : 'text-text-muted')}>Load</span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 rounded-full',
            'transition-transform duration-500 ease-[var(--ease-apple)] group-hover:scale-x-100',
            onDark ? 'bg-white/55' : 'bg-text/45',
          )}
        />
      </span>
    </Link>
  )
}
