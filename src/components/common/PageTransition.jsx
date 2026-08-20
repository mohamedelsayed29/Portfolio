import { motion } from 'motion/react'
import { EASE_APPLE } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'

/** A short cross-fade between routes — enough to feel intentional, not slow. */
export function PageTransition({ children }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) return children

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_APPLE }}
    >
      {children}
    </motion.main>
  )
}
