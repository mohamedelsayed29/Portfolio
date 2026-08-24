import {
  Building2,
  Dumbbell,
  HeartPulse,
  RefreshCw,
  Rocket,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react'
import { Section } from '@components/layout'
import { Reveal, SectionHeading } from '@components/common'
import { Card } from '@components/ui'

const AUDIENCES = [
  {
    icon: Sparkles,
    title: 'Have a SaaS idea?',
    body: 'We turn it into a live product: clear scope, a testable MVP, then staged growth from real market feedback.',
  },
  {
    icon: Rocket,
    title: 'Startups that need an MVP',
    body: 'Launch the first useful version quickly without burning time on features users do not need yet.',
  },
  {
    icon: RefreshCw,
    title: 'Companies with legacy systems',
    body: 'We enter existing codebases, find the root cause, and fix or refactor without reckless rewrites.',
  },
  {
    icon: HeartPulse,
    title: 'Clinics and medical centers',
    body: 'Bookings, patient files, payments, reminders, and operating dashboards that help teams serve patients better.',
  },
  {
    icon: Dumbbell,
    title: 'Gyms and fitness centers',
    body: 'Memberships, QR access, trainer bookings, branch occupancy, and mobile apps for members.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce teams',
    body: 'Arabic/English storefronts, catalogues, payments, offers, and admin tools for local and Gulf markets.',
  },
  {
    icon: Store,
    title: 'Teams that need AI automation',
    body: 'We connect AI to your data and real workflows: RAG, summarization, agents, and repeatable automation.',
  },
  {
    icon: Building2,
    title: 'Gulf companies needing a technical partner',
    body: 'We work as an external technical team with clear communication, weekly delivery, and full ownership handover.',
  },
]

export function AudienceSection() {
  const copy = {
    eyebrow: 'Who it is for',
    title: 'We build for teams that need a real product, not just a polished screen.',
    description:
      'Whether you have a SaaS idea, an old system slowing the team down, or a workflow that needs AI automation, we help turn it into a product that can grow.',
  }

  return (
    <Section id="fit" width="wide" className="bg-bg-elevated">
      <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          className="max-w-3xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {AUDIENCES.map((item, index) => {
          const Icon = item.icon

          return (
            <Reveal key={item.title} delay={index * 0.04} className="h-full">
              <Card className="flex h-full flex-col gap-5 p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-[14px] bg-accent-soft text-accent">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[19px] leading-tight font-semibold tracking-[-0.015em]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-muted">
                    {item.body}
                  </p>
                </div>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
