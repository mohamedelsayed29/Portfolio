import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@lib/cn'

const VARIANTS = {
  primary:
    'bg-accent text-accent-contrast hover:bg-accent-hover shadow-soft hover:shadow-card active:scale-[0.97]',
  secondary:
    'bg-surface text-text border border-line hover:border-line-strong hover:bg-surface-muted active:scale-[0.97]',
  subtle: 'bg-surface-muted text-text hover:bg-surface-sunken active:scale-[0.97]',
  ghost: 'text-text-muted hover:text-text hover:bg-surface-muted active:scale-[0.97]',
  // For use on the dark hero panel, where the themed variants have no contrast.
  inverse: 'bg-white text-[#0a0a0c] hover:bg-white/90 shadow-soft active:scale-[0.97]',
  themeContrast:
    'bg-[#0B1B33] text-white hover:bg-[#142b4d] shadow-soft active:scale-[0.97] dark:bg-white dark:text-[#0a0a0c] dark:hover:bg-white/90',
  inverseGhost: 'text-white/75 hover:text-white hover:bg-white/10 active:scale-[0.97]',
  link: 'text-accent hover:underline underline-offset-4 px-0! py-0! h-auto!',
}

const SIZES = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-6 text-[15px] gap-2',
  lg: 'h-[52px] px-8 text-[17px] gap-2.5',
  xl: 'h-16 px-10 text-[19px] gap-3.5 sm:h-[68px] sm:px-12',
}

/**
 * Apple's control shape: full pill, medium weight, no border on the primary,
 * and a very short press-scale rather than a colour flash.
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    children,
    to,
    href,
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'right',
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-medium tracking-[-0.01em]',
    'transition-all duration-300 ease-[var(--ease-apple)] whitespace-nowrap select-none',
    'disabled:pointer-events-none disabled:opacity-40',
    SIZES[size],
    VARIANTS[variant],
    className,
  )

  const content = (
    <>
      {loading ? (
        <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={17} aria-hidden="true" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={17} aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    const externalProps = href.startsWith('mailto:')
      ? {}
      : { target: '_blank', rel: 'noreferrer noopener' }

    return (
      <a
        ref={ref}
        href={href}
        {...externalProps}
        className={classes}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  )
})
