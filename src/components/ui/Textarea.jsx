import { forwardRef } from 'react'
import { cn } from '@lib/cn'
import { controlClasses } from './Input'

export const Textarea = forwardRef(function Textarea(
  { invalid = false, rows = 5, className, id, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(controlClasses(invalid), 'resize-y py-3.5 leading-relaxed', className)}
      {...props}
    />
  )
})
