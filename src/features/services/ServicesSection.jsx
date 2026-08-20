import { Section } from '@components/layout'
import { SERVICES } from '@data/services'
import { useBooking } from '@app/providers'
import { ServiceDeck } from './components/ServiceDeck'
import { ServiceRow } from './components/ServiceRow'

export function ServicesSection({ services = SERVICES }) {
  const { openBooking } = useBooking()
  const book = (service) => openBooking({ type: 'project', service: service.id })

  return (
    <Section id="services" width="wide">
      <div className="mb-14 max-w-[52ch]">
        <p className="mb-5 text-[13px] tracking-[0.08em] text-text-subtle uppercase">What we do</p>
        <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] font-semibold">
          Six things, and we say no to the rest.
        </h2>
      </div>

      <ServiceDeck services={services} onBook={book} />

      <p className="mt-8 hidden text-[13px] text-text-subtle md:block">
        Hover a card to bring it forward.
      </p>

      {/* Phones get the list: a fanned deck needs pointer hover and room the
          viewport does not have, and the descriptions read better stacked. */}
      <div className="border-b border-line md:hidden">
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} onBook={book} />
        ))}
      </div>
    </Section>
  )
}
