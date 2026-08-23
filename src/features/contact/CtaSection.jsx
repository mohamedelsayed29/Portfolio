import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Section } from '@components/layout'
import { SITE } from '@constants/site'

/** A compact final invitation that flows directly into the footer. */
export function CtaSection() {
  return (
    <Section
      id="closing-cta"
      width="wide"
      className="bg-[#08090b] py-0! text-white"
      aria-labelledby="footer-cta-title"
    >
      <div className="grid gap-7 border-y border-white/10 py-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12">
        <h2
          id="footer-cta-title"
          className="max-w-[18ch] font-brand text-[clamp(2rem,4vw,3rem)] leading-[1.02] font-bold tracking-[-0.04em]"
        >
          Bring us the hard part.
        </h2>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7 md:justify-end">
          <a
            href={`mailto:${SITE.email}`}
            aria-label={`Email HammerLoad at ${SITE.email}`}
            className="group inline-flex items-center gap-1.5 rounded-[6px] text-[14px] text-white/58 transition-colors duration-200 hover:text-white"
          >
            {SITE.email}
            <ArrowUpRight
              size={13}
              strokeWidth={1.8}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <Link
            to="/book?type=meeting"
            className="group inline-flex items-center gap-2 rounded-[6px] text-[15px] font-semibold text-white transition-colors duration-200 hover:text-[#F2A31B]"
          >
            Book a call
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
              className="text-[#F2A31B] transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  )
}
