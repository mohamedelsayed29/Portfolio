import { cn } from '@lib/cn'

const TONES = {
  neutral: 'bg-surface-muted text-text-muted',
  accent: 'bg-accent-soft text-accent',
  outline: 'border border-line text-text-muted',
  success: 'bg-success/12 text-success',
}

export function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
        'text-[12px] font-medium tracking-[-0.005em]',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
