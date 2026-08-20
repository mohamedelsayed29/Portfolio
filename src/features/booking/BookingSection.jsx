import { Clock, Mail, MapPin, ShieldCheck } from 'lucide-react'
import { Section } from '@components/layout'
import { Reveal } from '@components/common'
import { Card } from '@components/ui'
import { SITE } from '@constants/site'
import { BookingForm } from './components/BookingForm'

const ASSURANCES = [
  {
    icon: Clock,
    title: 'Answered within a day',
    body: 'A real person reads every request. Median first response is under 24 hours on weekdays.',
  },
  {
    icon: ShieldCheck,
    title: 'No sales pipeline',
    body: 'One reply, then a scope or an honest "not us". Your address never enters a mailing list.',
  },
  {
    icon: Mail,
    title: 'Prefer plain email?',
    body: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: MapPin,
    title: 'Where we are',
    body: SITE.location,
  },
]

/** The full booking experience used on /book — form plus the reassurance column. */
export function BookingSection({ initialValues = {} }) {
  return (
    <Section id="book" width="wide" spacing="sm">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8">
          <Reveal>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-semibold">
              Let's get it
              <br />
              on the calendar.
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-text-muted">
              Book a scoped project or a thirty-minute call. Either way you talk to the people who
              would write the code — there is no account manager in between.
            </p>
          </Reveal>

          <ul className="flex flex-col gap-5">
            {ASSURANCES.map((item, index) => {
              const Icon = item.icon

              return (
                <Reveal as="li" key={item.title} delay={0.12 + index * 0.06}>
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-surface-muted text-text-muted">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{item.title}</h2>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[14px] text-accent transition-colors hover:underline"
                        >
                          {item.body}
                        </a>
                      ) : (
                        <p className="max-w-[38ch] text-[14px] leading-relaxed text-text-muted">
                          {item.body}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="min-w-0">
          <Card className="min-w-0 p-7 shadow-card sm:p-10">
            <BookingForm initialValues={initialValues} />
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
