import { cn } from '@lib/cn'

export function Card({ as: Tag = 'div', interactive = false, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-[var(--radius-apple-lg)] border border-line bg-surface',
        'transition-all duration-500 ease-[var(--ease-apple)]',
        interactive && 'hover:-translate-y-1 hover:border-line-strong hover:shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
