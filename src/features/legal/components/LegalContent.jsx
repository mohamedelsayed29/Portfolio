import { cn } from '@lib/cn'

export function LegalSection({ id, number, title, children }) {
  const headingId = `${id}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-line py-9 first:border-t-0 first:pt-0 sm:py-11"
    >
      <div className="grid gap-3 sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-5">
        <span className="pt-1 font-mono text-[11px] text-accent" aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <div>
          <h2 id={headingId} className="text-[24px] leading-tight font-semibold sm:text-[28px]">
            {title}
          </h2>
          <div className="mt-5 grid gap-4">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function LegalText({ className, children }) {
  return (
    <p className={cn('max-w-[68ch] text-[15px] leading-7 text-text-muted sm:text-[16px]', className)}>
      {children}
    </p>
  )
}

export function LegalSubheading({ children }) {
  return <h3 className="pt-2 text-[16px] leading-6 font-semibold text-text">{children}</h3>
}

export function LegalList({ ordered = false, children }) {
  const Tag = ordered ? 'ol' : 'ul'

  return (
    <Tag
      className={cn(
        'grid max-w-[66ch] gap-2 pl-5 text-[15px] leading-7 text-text-muted marker:text-text-subtle sm:text-[16px]',
        ordered ? 'list-decimal' : 'list-disc',
      )}
    >
      {children}
    </Tag>
  )
}

export function LegalNotice({ children, tone = 'neutral' }) {
  return (
    <div
      className={cn(
        'my-2 border-l-2 py-3 pr-4 pl-5 text-[15px] leading-7 sm:text-[16px]',
        tone === 'warning'
          ? 'border-warning bg-surface-muted text-text'
          : 'border-accent bg-accent-soft text-text',
      )}
    >
      {children}
    </div>
  )
}
