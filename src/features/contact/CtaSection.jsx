import { ArrowRight, Calendar } from 'lucide-react'
import { Section } from '@components/layout'
import { Reveal } from '@components/common'
import { Button } from '@components/ui'
import { useBooking } from '@app/providers'
import { SITE } from '@constants/site'

/** Closing band. One decision, two doors: scope a project, or just talk. */
export function CtaSection() {
  const { openBooking } = useBooking()

  return (
    <Section spacing="lg" width="wide">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] border border-line bg-surface px-8 py-20 text-center sm:px-16">
          <div className="relative flex flex-col items-center gap-7">
            <h2 className="max-w-[18ch] text-[clamp(2.25rem,6vw,4rem)] leading-[1.04] font-semibold">
              Tell us what you are building.
            </h2>

            <p className="max-w-[52ch] text-[17px] leading-relaxed text-text-muted sm:text-[19px]">
              Or what stopped working. Both conversations start the same way — thirty minutes, no
              deck, and an honest answer about whether we are the right team.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" icon={ArrowRight} onClick={() => openBooking({ type: 'project' })}>
                Book a project
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={Calendar}
                iconPosition="left"
                onClick={() => openBooking({ type: 'meeting' })}
              >
                Book a meeting
              </Button>
            </div>

            <a
              href={`mailto:${SITE.email}`}
              className="text-[14px] text-text-subtle transition-colors hover:text-text"
            >
              or email {SITE.email}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
