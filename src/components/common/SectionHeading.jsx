import { cn } from '@lib/cn'

/**
 * Eyebrow, headline, sub-copy.
 *
 * The eyebrow is quiet uppercase text rather than a coloured badge pill — a
 * tinted pill above every single section is stock-template furniture, and it
 * competes with the headline it is supposed to introduce. Nothing here animates
 * on scroll either; the reveal now belongs to the content below it, not the
 * heading that labels it.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  children,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[13px] tracking-[0.08em] text-text-subtle uppercase">{eyebrow}</p>
      )}

      <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] font-semibold">{title}</h2>

      {description && (
        <p
          className={cn(
            'max-w-[54ch] text-[17px] leading-relaxed text-text-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}

      {children}
    </div>
  )
}
