import { motion } from 'motion/react'
import { fadeUp, viewportOnce } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'

/**
 * Scroll-triggered entrance. Everything below the fold uses this rather than
 * hand-rolled variants, which keeps the whole page on one motion curve.
 */
export function Reveal({
  as = 'div',
  variants = fadeUp,
  delay = 0,
  className,
  children,
  ...props
}) {
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
