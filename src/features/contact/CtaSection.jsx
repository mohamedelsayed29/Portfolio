import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@components/common'
import { Section } from '@components/layout'
import { Button } from '@components/ui'
import { SITE } from '@constants/site'

/** A distinct final conversion section that leads into the quiet footer. */
export function CtaSection() {
  return (
    <Section
      id="closing-cta"
      width="wide"
      className="bg-bg-elevated pt-12! pb-0! text-text sm:pt-16! lg:pt-24! dark:bg-[#08090b] dark:text-white"
      aria-labelledby="footer-cta-title"
    >
      <div className="border-y border-line">
        <Reveal className="grid gap-8 py-12 sm:py-14 md:grid-cols-[minmax(0,1.15fr)_minmax(360px,1fr)] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(440px,1fr)] lg:gap-12 lg:py-14">
          <h2
            id="footer-cta-title"
            className="font-brand text-[clamp(2.5rem,4vw,4rem)] leading-[0.98] font-bold tracking-[-0.045em]"
          >
            Bring us the hard part.
          </h2>

          <div className="flex w-full min-w-0 flex-col justify-center py-2 sm:py-3 md:min-h-[176px] md:border-l md:border-line md:py-0 md:pl-6 lg:min-h-[184px] lg:pl-10 xl:pl-12">
            <div className="flex w-full flex-col items-stretch gap-5 md:ml-auto md:max-w-[460px]">
              <Button
                to="/book?type=meeting"
                size="xl"
                variant="themeContrast"
                icon={ArrowRight}
                className="group w-full font-semibold hover:scale-[1.02] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-2"
              >
                Book a call
              </Button>

              <a
                href={`mailto:${SITE.email}`}
                aria-label={`Email HammerLoad at ${SITE.email}`}
                className="group inline-flex w-fit items-center gap-1.5 rounded-[6px] text-[14px] text-text-muted transition-colors duration-200 hover:text-text"
              >
                {SITE.email}
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
