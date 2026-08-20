import { Section } from '@components/layout'
import { SERVICES } from '@data/services'
import { useBooking } from '@app/providers'
import { ServiceDeck } from './components/ServiceDeck'
import './services.css'

export function ServicesSection({ services = SERVICES }) {
  const { openBooking } = useBooking()
  const book = (service) => openBooking({ type: 'project', service: service.id })

  return (
    <Section
      id="services"
      width="wide"
      className="service-section overflow-hidden border-y border-white/[0.075] text-[#f7f8fc]"
      containerClassName="relative z-[1]"
    >
      <div className="mb-10 max-w-[60ch] sm:mb-12 lg:mb-14">
        <p className="service-section__eyebrow mb-5 text-[12px] font-medium tracking-[0.16em] uppercase">
          What we do
        </p>
        <h2 className="max-w-[18ch] text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          Six things, and we say no to the rest.
        </h2>
      </div>

      <ServiceDeck services={services} onBook={book} />
    </Section>
  )
}
