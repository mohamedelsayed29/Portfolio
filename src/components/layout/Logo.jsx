import { Link } from 'react-router-dom'
import { SITE } from '@constants/site'
import { useStrings } from '@/i18n'
import { HammerLoadLogo } from '@components/brand'
import { cn } from '@lib/cn'

const STRINGS = {
  en: { homeLabel: `${SITE.name} home` },
  ar: { homeLabel: `${SITE.name} — الصفحة الرئيسية` },
}

export function Logo({ className, onClick, onDark = false }) {
  const s = useStrings(STRINGS)

  const handleClick = (event) => {
    onClick?.(event)

    if (event.defaultPrevented || window.location.pathname !== '/') return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  return (
    <Link
      to="/"
      onClick={handleClick}
      aria-label={s.homeLabel}
      className={cn(
        'group inline-flex min-w-[120px] items-center rounded-[8px] py-0.5',
        'transition-opacity duration-300 ease-[var(--ease-apple)] hover:opacity-[0.82]',
        className,
      )}
    >
      <HammerLoadLogo variant={onDark ? 'onDark' : 'theme'} />
    </Link>
  )
}
