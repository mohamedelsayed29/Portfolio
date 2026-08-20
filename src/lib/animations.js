/**
 * Shared motion variants. Apple's motion language: nothing bounces, everything
 * decelerates. The easing curve below is the one used across their marketing
 * pages — a long tail that settles rather than snaps.
 */
export const EASE_APPLE = [0.32, 0.72, 0, 1]
export const EASE_OUT = [0.16, 1, 0.3, 1]

/**
 * Deliberately small and quick. A long 26px fade-up on every element on the
 * page reads as a template; 10px over 0.5s registers as the content settling
 * and then gets out of the way.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_APPLE },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_APPLE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_APPLE },
  },
}

export const blurUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_APPLE },
  },
}

/** Parent wrapper that cascades its children in. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/** Per-word hero headline reveal. */
export const wordReveal = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -45 },
  visible: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transition: { duration: 0.95, ease: EASE_APPLE },
  },
}

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const modalPanel = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE_APPLE } },
  exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.22, ease: EASE_APPLE } },
}

/** Default viewport config so sections animate once, slightly before entry. */
export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' }
