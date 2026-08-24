import { Section } from '@components/layout'
import { SERVICES } from '@data/services'
import { useBooking } from '@app/providers'
import { useLocalized, useStrings } from '@/i18n'
import { ServiceDeck } from './components/ServiceDeck'
import './services.css'

const STRINGS = {
  en: {
    eyebrow: 'What we do',
    heading: 'Six things, and we say no to the rest.',
  },
  ar: {
    eyebrow: 'ماذا نقدّم',
    heading: 'ستة أشياء نتقنها — ونقول «لا» لما عداها.',
  },
}

export function ServicesSection({ services = SERVICES }) {
  const { openBooking } = useBooking()
  const s = useStrings(STRINGS)
  const localizedServices = useLocalized(services)
  const book = (service) => openBooking({ type: 'project', service: service.id })

  return (
    <Section
      id="services"
      width="wide"
      className="service-section overflow-hidden border-y border-line text-text"
      containerClassName="relative z-[1]"
    >
      <div className="mb-10 max-w-[60ch] sm:mb-12 lg:mb-14">
        <p className="service-section__eyebrow mb-5 text-[12px] font-medium tracking-[0.16em] uppercase">
          {s.eyebrow}
        </p>
        <h2 className="max-w-[18ch] text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          {s.heading}
        </h2>
      </div>

      <ServiceDeck services={localizedServices} onBook={book} />
    </Section>
  )
}
