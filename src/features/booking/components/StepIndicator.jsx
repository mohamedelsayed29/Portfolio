import { motion } from 'motion/react'
import { cn } from '@lib/cn'
import { EASE_APPLE } from '@lib/animations'

const LABELS = { type: 'Engagement', details: 'Details', contact: 'Contact' }

export function StepIndicator({ steps, currentIndex }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Booking progress">
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo'

        return (
          <li key={step} className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <span
                className={cn(
                  'text-[11px] font-medium tracking-[0.06em] uppercase transition-colors duration-300',
                  state === 'todo' ? 'text-text-subtle' : 'text-text',
                )}
              >
                {LABELS[step]}
              </span>
              <span className="h-[3px] overflow-hidden rounded-full bg-surface-sunken">
                <motion.span
                  initial={false}
                  animate={{ scaleX: state === 'todo' ? 0 : 1 }}
                  transition={{ duration: 0.5, ease: EASE_APPLE }}
                  style={{ transformOrigin: 'left' }}
                  className={cn(
                    'block h-full w-full rounded-full',
                    state === 'done' ? 'bg-success' : 'bg-accent',
                  )}
                />
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
