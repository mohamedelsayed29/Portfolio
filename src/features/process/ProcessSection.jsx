import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Section } from '@components/layout'
import { SectionHeading } from '@components/common'
import { useLocalized, useStrings } from '@/i18n'
import { PROCESS_STEPS } from '@data/process'
import { ProcessStep } from './components/ProcessStep'

const STRINGS = {
  en: {
    eyebrow: 'How it works',
    title: 'Four steps, no mystery',
    description: 'The same sequence whether it is a two-day bug hunt or a six-month build.',
  },
  ar: {
    eyebrow: 'منهجية العمل',
    title: 'أربع خطوات، بلا غموض',
    description: 'التسلسل نفسه، سواء كان تعقّب خطأ يستغرق يومين أو مشروعًا يمتد ستة أشهر.',
  },
}

/**
 * The connecting line fills as the section scrolls, so progress through the
 * process is literally drawn as you read it.
 */
export function ProcessSection({ steps = PROCESS_STEPS }) {
  const listRef = useRef(null)
  const s = useStrings(STRINGS)
  const localizedSteps = useLocalized(steps)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 70%', 'end 60%'],
  })

  const scaleY = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.6 })

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={s.eyebrow}
        title={s.title}
        description={s.description}
        className="mb-16"
      />

      <div ref={listRef} className="relative">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 start-[21px] w-px bg-line sm:start-[27px]"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY, transformOrigin: 'top' }}
          className="absolute top-0 bottom-0 start-[21px] w-px bg-accent sm:start-[27px]"
        />

        <ol className="relative flex flex-col">
          {localizedSteps.map((step, index) => (
            <ProcessStep key={step.step} step={step} index={index} />
          ))}
        </ol>
      </div>
    </Section>
  )
}

