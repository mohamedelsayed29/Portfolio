import { Gauge, Users, Wrench, Zap } from 'lucide-react'
import { Section } from '@components/layout'
import { Seo, SectionHeading, Reveal, PageTransition } from '@components/common'
import { Card } from '@components/ui'
import { STATS } from '@constants/site'
import { ProcessSection } from '@features/process'
import { CtaSection } from '@features/contact'

const PRINCIPLES = [
  {
    icon: Wrench,
    title: 'Small team, senior only',
    body: 'Everyone who touches your code has shipped and maintained production systems. Nobody is learning on your budget.',
  },
  {
    icon: Zap,
    title: 'Weekly, working software',
    body: 'You see a deploy every week from week one. No four-week silence followed by a surprise.',
  },
  {
    icon: Gauge,
    title: 'Boring where it counts',
    body: 'We reach for the exciting tool in the prototype and the proven one in production. Your on-call rotation will thank us.',
  },
  {
    icon: Users,
    title: 'You keep everything',
    body: 'Your repository, your infrastructure, your credentials, your model weights. We leave documentation, not dependency.',
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <Seo
        title="About"
        description="A small, senior software studio building web, mobile, backend and AI systems — and fixing the ones that broke."
      />

      <Section width="wide" spacing="sm" className="pt-20">
        <SectionHeading
          eyebrow="About the studio"
          title="Engineers who stayed engineers"
          description="We started in 2017 doing rescue work for teams whose agency had walked away. Nine years later that is still the bar: build something the client's own engineers are glad to inherit."
          className="mb-16 max-w-3xl"
        />

        <dl className="grid grid-cols-2 gap-8 border-y border-line py-10 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06} className="flex flex-col gap-1">
              <dd className="text-[36px] font-semibold tracking-[-0.025em]">{stat.value}</dd>
              <dt className="text-[14px] text-text-subtle">{stat.label}</dt>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section width="wide" spacing="sm">
        <div className="grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon

            return (
              <Reveal key={principle.title} delay={index * 0.06} className="h-full">
                <Card className="flex h-full flex-col gap-4 p-8">
                  <span className="grid size-11 place-items-center rounded-[13px] bg-accent-soft text-accent">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h2 className="text-[20px] font-semibold tracking-[-0.015em]">
                    {principle.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-text-muted">{principle.body}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <ProcessSection />
      <CtaSection />
    </PageTransition>
  )
}
