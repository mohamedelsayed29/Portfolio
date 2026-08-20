import { lazy, Suspense, useRef } from 'react'
import { motion } from 'motion/react'
import { Button } from '@components/ui'
import { EASE_APPLE } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'
import { useBooking } from '@app/providers'
import { SITE } from '@constants/site'
import { HeroMarquee } from './components/HeroMarquee'

const InteractiveHeroBackground = lazy(() => import('./components/InteractiveHeroBackground'))

/**
 * A full-bleed dark panel, inset from the viewport edges and slid up under the
 * fixed nav so the nav pill floats inside it.
 *
 * The panel is dark in both themes — it is a brand surface, not a themed one.
 * Its custom WebGL artwork is isolated behind the content and clipped by the
 * panel itself. The CSS fallback is always present beneath the canvas.
 */
/** Honest meta, in place of the reference's download counters. */
const META = [
  { label: 'Availability', value: 'Booking for Q4' },
  { label: 'Based', value: 'Remote · GMT+2' },
  { label: 'Contact', value: SITE.email, href: `mailto:${SITE.email}` },
]

const line = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_APPLE } },
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const { openBooking } = useBooking()

  const panelRef = useRef(null)

  const stagger = reduced
    ? {}
    : {
        variants: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } },
        initial: 'hidden',
        animate: 'visible',
      }
  const item = reduced ? undefined : line

  return (
    <>
      {/* Pulled up under the fixed nav, then padded back down inside. */}
      <div className="-mt-[var(--nav-h)] p-3 sm:p-4">
        <div
          ref={panelRef}
          className="relative isolate flex min-h-[min(100svh-1.5rem,58rem)] flex-col overflow-hidden rounded-[28px] bg-[#01030a] pt-32 sm:rounded-[40px]"
        >
          <div aria-hidden="true" className="hero-art-fallback pointer-events-none absolute inset-0 z-0" />
          <Suspense fallback={null}>
            <InteractiveHeroBackground containerRef={panelRef} reducedMotion={reduced} />
          </Suspense>
          <div aria-hidden="true" className="hero-art-contrast pointer-events-none absolute inset-0 z-[1]" />

          <motion.div
            {...stagger}
            data-hero-content
            className="relative z-[2] flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-10"
          >
            <motion.h1
              variants={item}
              className="max-w-[16ch] text-[clamp(2.75rem,8.4vw,6.75rem)] leading-[0.98] font-medium tracking-[-0.03em] text-white"
            >
              We build software. We also fix it.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-[64ch] font-mono text-[13px] leading-relaxed text-white/60 sm:text-[15px]"
            >
              Web, mobile, backend and AI systems. Built from scratch, or rescued from someone
              else&rsquo;s.
            </motion.p>
          </motion.div>

          <motion.div
            {...stagger}
            data-hero-content
            className="relative z-[2] grid gap-10 px-6 pb-10 sm:px-10 lg:grid-cols-3 lg:items-end"
          >
            <div className="hidden lg:block" />

            <motion.div
              variants={item}
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Button
                size="lg"
                variant="inverse"
                onClick={() => openBooking({ type: 'project' })}
                className="w-full sm:w-auto"
              >
                Book a project
              </Button>
              <Button
                size="lg"
                variant="inverseGhost"
                to="/work"
                className="w-full sm:w-auto"
              >
                See the work
              </Button>
            </motion.div>

            <motion.dl
              variants={item}
              className="flex flex-col gap-2 font-mono text-[12px] sm:text-[13px] lg:items-end"
            >
              {META.map((entry) => (
                <div key={entry.label} className="flex items-baseline gap-4">
                  <dt className="text-white/40">{entry.label}</dt>
                  <dd className="text-white/85">
                    {entry.href ? (
                      <a
                        href={entry.href}
                        className="underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white"
                      >
                        {entry.value}
                      </a>
                    ) : (
                      entry.value
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>

      {/* Kept off the panel: logo marks are coloured for the page theme, not the panel. */}
      <div className="py-10">
        <HeroMarquee />
      </div>
    </>
  )
}
