import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { EASE_APPLE } from '@lib/animations'
import { cn } from '@lib/cn'

export function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-[17px] font-medium tracking-[-0.01em] sm:text-[19px]">
            {faq.question}
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={cn(
              'shrink-0 text-text-subtle transition-transform duration-400 ease-[var(--ease-apple)]',
              open && 'rotate-180',
            )}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_APPLE }}
            className="overflow-hidden"
          >
            <p className="max-w-[62ch] pb-6 text-[16px] leading-relaxed text-text-muted">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
