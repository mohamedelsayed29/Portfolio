import { useState } from 'react'
import { motion } from 'motion/react'
import { staggerContainer, viewportOnce } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'
import { ServiceCard } from './ServiceCard'

/**
 * Six overlapping cards, hand-tilted so the row reads as a dealt hand rather
 * than a grid. Every card shares a single CSS grid cell (`[grid-area:1/1]`),
 * which centres them all without a translate of our own — Motion then owns the
 * transform outright and the fan is expressed purely as variants.
 *
 * The deal is `whileInView` rather than scroll-linked: it keeps the section on
 * the same motion curve as the rest of the page, and a scroll-tied fan spends
 * most of its life half-open, which reads as a rendering glitch.
 *
 * `STEP` is a percentage of card width, so the fan keeps its proportions from
 * the tablet size up to the widest card without per-breakpoint maths.
 */
const STEP = 44

/** Hand-tuned, not generated: an even scatter looks mechanical at this size. */
const TILTS = [-7, 4.5, -3.5, 3, -5.5, 6.5]
const LIFTS = [6, -3, 7, -2, 5, 1]

export function ServiceDeck({ services, onBook }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(null)

  const centre = (services.length - 1) / 2

  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={viewportOnce}
      className="relative hidden h-[17rem] select-none md:block lg:h-[23rem] xl:h-[29rem]"
      onMouseLeave={() => setActive(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null)
      }}
    >
      <div className="grid h-full place-items-center">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            offset={(index - centre) * STEP}
            tilt={TILTS[index % TILTS.length]}
            lift={LIFTS[index % LIFTS.length]}
            isActive={active === index}
            isMuted={active !== null && active !== index}
            onActivate={() => setActive(index)}
            onBook={onBook}
          />
        ))}
      </div>
    </motion.div>
  )
}
