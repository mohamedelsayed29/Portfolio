import { CircleAlert } from 'lucide-react'
import { cn } from '@lib/cn'

/**
 * Label + control + message wrapper. Owns the a11y wiring so each control only
 * has to accept an id: the error is announced, the hint is described.
 */
export function Field({ id, label, hint, error, required = false, className, children }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-medium tracking-[-0.005em] text-text-muted"
        >
          {label}
          {required && (
            <span className="ms-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] text-danger"
        >
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-[13px] text-text-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
