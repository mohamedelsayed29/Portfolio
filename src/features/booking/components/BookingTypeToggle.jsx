import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { BOOKING_TYPES } from '@data/booking'
import { cn } from '@lib/cn'
import { EASE_APPLE } from '@lib/animations'

export function BookingTypeToggle({ value, onChange }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="sr-only">What would you like to book?</legend>

      {BOOKING_TYPES.map((type) => {
        const selected = value === type.id
        const Icon = type.icon

        return (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type.id)}
            className={cn(
              'group relative flex flex-col gap-3 rounded-[var(--radius-apple)] border p-5 text-left',
              'transition-all duration-400 ease-[var(--ease-apple)]',
              selected
                ? 'border-accent bg-accent-soft'
                : 'border-line bg-surface hover:border-line-strong hover:bg-surface-muted',
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'grid size-10 place-items-center rounded-[12px] transition-colors duration-300',
                  selected ? 'bg-accent text-accent-contrast' : 'bg-surface-muted text-text-muted',
                )}
              >
                <Icon size={18} aria-hidden="true" />
              </span>

              {selected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: EASE_APPLE }}
                  className="grid size-5 place-items-center rounded-full bg-accent text-accent-contrast"
                >
                  <Check size={12} aria-hidden="true" />
                </motion.span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[16px] font-semibold tracking-[-0.01em]">{type.label}</span>
              <span className="text-[12px] text-text-subtle">{type.tagline}</span>
            </div>

            <p className="text-[13px] leading-relaxed text-text-muted">{type.description}</p>
          </button>
        )
      })}
    </fieldset>
  )
}
