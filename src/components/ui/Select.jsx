import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@lib/cn'
import { controlClasses } from './Input'

export const Select = forwardRef(function Select(
  { invalid = false, options = [], placeholder, className, id, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(controlClasses(invalid), 'h-12 cursor-pointer appearance-none pr-11', className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-subtle"
      />
    </div>
  )
})
