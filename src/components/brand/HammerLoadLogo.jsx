import { cn } from '@lib/cn'

/**
 * Official HammerLoad symbol. The 200 x 200 canvas and the 104 x 112 H
 * geometry come directly from the HammerLoad brand identity document.
 */
export function HammerLoadMark({ variant = 'theme', className, title }) {
  const labelled = Boolean(title)

  return (
    <svg
      viewBox="0 0 200 200"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : 'true'}
      aria-label={labelled ? title : undefined}
      focusable="false"
      className={cn('hammerload-mark block shrink-0', `hammerload-mark--${variant}`, className)}
    >
      <rect x="48" y="44" width="24" height="112" fill="var(--hammerload-mark-ink)" />
      <rect x="128" y="44" width="24" height="112" fill="var(--hammerload-mark-ink)" />
      <rect x="72" y="88" width="56" height="24" fill="var(--hammerload-mark-track)" />
      <rect x="72" y="88" width="34.72" height="24" fill="var(--hammerload-mark-accent)" />
    </svg>
  )
}

/** Official horizontal lockup without the tagline, sized for application chrome. */
export function HammerLoadLogo({ variant = 'theme', markClassName, className }) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      <HammerLoadMark variant={variant} className={cn('size-8', markClassName)} />
      <span
        aria-hidden="true"
        className={cn(
          'font-brand text-[20px] leading-none font-bold tracking-[-0.035em]',
          variant === 'onDark' ? 'text-white' : 'text-[#0B1B33] dark:text-white',
        )}
      >
        HammerLoad
      </span>
    </span>
  )
}
