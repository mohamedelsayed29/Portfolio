import { forwardRef } from 'react'
import { cn } from '@lib/cn'

export const controlClasses = (invalid) =>
  cn(
    'w-full rounded-[14px] bg-surface-muted px-4 text-[15px] text-text',
    'border transition-all duration-200 ease-[var(--ease-apple)]',
    'placeholder:text-text-subtle',
    'focus:bg-surface focus:outline-none focus:ring-4 focus:ring-accent/16',
    invalid
      ? 'border-danger focus:border-danger focus:ring-danger/16'
      : 'border-transparent focus:border-accent',
  )

export const Input = forwardRef(function Input({ invalid = false, className, id, ...props }, ref) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(controlClasses(invalid), 'h-12', className)}
      {...props}
    />
  )
})
