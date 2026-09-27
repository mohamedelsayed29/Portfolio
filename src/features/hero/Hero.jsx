import { lazy, Suspense, useRef } from 'react'
import { motion } from 'motion/react'
import { Button } from '@components/ui'
import { EASE_APPLE } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'
import { useBooking } from '@app/providers'
import { localizedPath, useLanguage, useStrings } from '@/i18n'
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
const STRINGS = {
  en: {
    headline: 'We build software. We also fix it.',
    subheadline:
      'Web, mobile, backend and AI systems. Built from scratch, or rescued from someone else’s.',
    bookProject: 'Book a project',
    seeWork: 'See the work',
    metaAvailabilityLabel: 'Availability',
    metaAvailabilityValue: 'Booking for Q4',
    metaBasedLabel: 'Based',
    metaBasedValue: 'Remote · GMT+2',
    metaContactLabel: 'Contact',
  },
  ar: {
    headline: 'نبني البرمجيات. ونصلحها أيضًا.',
    subheadline:
      'ويب، موبايل، أنظمة خلفية، وذكاء اصطناعي. نبنيها من الصفر، أو ننقذ ما بناه غيرنا.',
    bookProject: 'احجز مشروعًا',
    seeWork: 'شاهد أعمالنا',
    metaAvailabilityLabel: 'التوفر',
    metaAvailabilityValue: 'الحجز مفتوح للربع الرابع',
    metaBasedLabel: 'المقر',
    metaBasedValue: 'عن بُعد · GMT+2',
    metaContactLabel: 'تواصل معنا',
  },
}

const line = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_APPLE } },
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const { openBooking } = useBooking()
  const { language } = useLanguage()
  const s = useStrings(STRINGS)

  const panelRef = useRef(null)

  /** Honest meta, in place of the reference's download counters. */
  const meta = [
    { label: s.metaAvailabilityLabel, value: s.metaAvailabilityValue },
    { label: s.metaBasedLabel, value: s.metaBasedValue },
    { label: s.metaContactLabel, value: SITE.email, href: `mailto:${SITE.email}` },
  ]

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
              {s.headline}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-[64ch] font-mono text-[13px] leading-relaxed text-white/60 sm:text-[15px]"
            >
              {s.subheadline}
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
                {s.bookProject}
              </Button>
              <Button
                size="lg"
                variant="inverseGhost"
                to={localizedPath('/work', language)}
                className="w-full sm:w-auto"
              >
                {s.seeWork}
              </Button>
            </motion.div>

            <motion.dl
              variants={item}
              className="flex flex-col gap-2 font-mono text-[12px] sm:text-[13px] lg:items-end"
            >
              {meta.map((entry) => (
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
