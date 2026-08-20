import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@lib/cn'
import { modalBackdrop, modalPanel } from '@lib/animations'
import { useEscapeKey, useLockBodyScroll } from '@hooks'

export function Modal({ open, onClose, title, description, className, children }) {
  const panelRef = useRef(null)
  const restoreFocusRef = useRef(null)

  useLockBodyScroll(open)
  useEscapeKey(onClose, open)

  // Return focus to whatever opened the dialog once it closes.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      panelRef.current?.focus()
    } else {
      restoreFocusRef.current?.focus?.()
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative flex w-full max-w-lg flex-col overflow-hidden bg-bg-elevated shadow-float outline-none',
              // Tall forms (the project branch) must scroll inside the panel
              // rather than run off the bottom of the viewport.
              'max-h-[92svh] sm:max-h-[88svh]',
              'rounded-t-[var(--radius-apple-lg)] sm:rounded-[var(--radius-apple-lg)]',
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 z-10 grid size-8 place-items-center rounded-full bg-surface-muted text-text-muted transition-colors hover:bg-surface-sunken hover:text-text"
            >
              <X size={16} aria-hidden="true" />
            </button>

            {(title || description) && (
              <header className="shrink-0 px-7 pt-7 pr-16 pb-2">
                {title && (
                  <h2 className="text-[24px] font-semibold tracking-[-0.02em]">{title}</h2>
                )}
                {description && <p className="mt-2 text-[15px] text-text-muted">{description}</p>}
              </header>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-7 pt-4 pb-7">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
