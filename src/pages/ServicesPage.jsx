import { Check } from 'lucide-react'
import { Section } from '@components/layout'
import { Seo, SectionHeading, Reveal, PageTransition } from '@components/common'
import { Badge, Button, Card } from '@components/ui'
import { SERVICES } from '@data/services'
import { SERVICE_ICONS } from '@features/services'
import { CtaSection, FaqSection } from '@features/contact'
import { useBooking } from '@app/providers'

export default function ServicesPage() {
  const { openBooking } = useBooking()

  return (
    <PageTransition>
      <Seo
        title="Services"
        description="Frontend, backend, mobile, AI/LLM, bug fixing and technical discovery — what each engagement includes and what it costs."
      />

      <Section width="wide" spacing="sm" className="pt-20">
        <SectionHeading
          eyebrow="Services"
          title="What you can hand us"
          description="Six practices, one team. Most engagements combine two or three of them — pick the closest fit and we will shape the rest in the scoping call."
          className="mb-16 max-w-3xl"
        />

        <div className="flex flex-col gap-6">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon]

            return (
              <Reveal key={service.id} delay={index * 0.05}>
                <Card
                  id={service.id}
                  className="grid scroll-mt-28 gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.15fr]"
                >
                  <div className="flex flex-col gap-5">
                    <span
                      className="grid size-12 place-items-center rounded-[14px]"
                      style={{
                        background: `color-mix(in srgb, ${service.accent} 14%, transparent)`,
                      }}
                    >
                      {Icon && (
                        <Icon size={22} style={{ color: service.accent }} aria-hidden="true" />
                      )}
                    </span>

                    <h2 className="text-[30px] leading-tight font-semibold tracking-[-0.02em]">
                      {service.title}
                    </h2>

                    <p className="max-w-[44ch] text-[16px] leading-relaxed text-text-muted">
                      {service.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <Badge tone="outline">{service.timeline}</Badge>
                      <Badge tone="accent">
                        From ${service.startingAt.toLocaleString('en-US')}
                      </Badge>
                    </div>

                    <Button
                      className="mt-3 self-start"
                      onClick={() => openBooking({ type: 'project', service: service.id })}
                    >
                      Book {service.title.toLowerCase()}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-8 lg:border-l lg:border-line lg:pl-10">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                        What you get
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {service.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-[15px] text-text-muted"
                          >
                            <Check
                              size={15}
                              className="mt-1 shrink-0 text-accent"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                        Typical stack
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {service.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full bg-surface-muted px-3 py-1.5 text-[13px] text-text-muted"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <FaqSection />
      <CtaSection />
    </PageTransition>
  )
}
