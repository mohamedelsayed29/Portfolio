import { Gauge, Users, Wrench, Zap } from 'lucide-react'
import { Section } from '@components/layout'
import { Seo, SectionHeading, Reveal, PageTransition } from '@components/common'
import { Card } from '@components/ui'
import { STATS } from '@constants/site'
import { useLocalized, useStrings } from '@/i18n'
import { ProcessSection } from '@features/process'
import { CtaSection } from '@features/contact'

const PRINCIPLES = [
  {
    icon: Wrench,
    title: {
      en: 'Small team, senior only',
      ar: 'فريق صغير، خبراء فقط',
    },
    body: {
      en: 'Everyone who touches your code has shipped and maintained production systems. Nobody is learning on your budget.',
      ar: 'كل من يعمل على الكود لديك سبق أن أطلق أنظمة إنتاج حقيقية وتولّى صيانتها. لا أحد يتعلّم على حسابك.',
    },
  },
  {
    icon: Zap,
    title: {
      en: 'Weekly, working software',
      ar: 'برمجيات تعمل، كل أسبوع',
    },
    body: {
      en: 'You see a deploy every week from week one. No four-week silence followed by a surprise.',
      ar: 'ترى إصدارًا منشورًا كل أسبوع منذ الأسبوع الأول — لا صمت لأربعة أسابيع تليه مفاجأة.',
    },
  },
  {
    icon: Gauge,
    title: {
      en: 'Boring where it counts',
      ar: 'خيارات مجرّبة حيث يهمّ الأمر',
    },
    body: {
      en: 'We reach for the exciting tool in the prototype and the proven one in production. Your on-call rotation will thank us.',
      ar: 'نجرّب الأدوات الجديدة في النموذج الأولي، ونعتمد المجرّبة منها في الإنتاج. فريق المناوبة لديك سيشكرنا على ذلك.',
    },
  },
  {
    icon: Users,
    title: {
      en: 'You keep everything',
      ar: 'كل شيء يبقى ملكك',
    },
    body: {
      en: 'Your repository, your infrastructure, your credentials, your model weights. We leave documentation, not dependency.',
      ar: 'المستودع لك، والبنية التحتية لك، وبيانات الاعتماد لك، وحتى أوزان النماذج لك. نترك خلفنا توثيقًا واضحًا، لا تبعيةً لنا.',
    },
  },
]

const STRINGS = {
  en: {
    seoTitle: 'About',
    seoDescription:
      'A small, senior software studio building web, mobile, backend and AI systems — and fixing the ones that broke.',
    eyebrow: 'About the studio',
    title: 'Engineers who stayed engineers',
    description:
      "We started in 2017 doing rescue work for teams whose agency had walked away. Nine years later that is still the bar: build something the client's own engineers are glad to inherit.",
  },
  ar: {
    seoTitle: 'من نحن',
    seoDescription:
      'استوديو برمجيات صغير من مهندسين خبراء، يبني أنظمة الويب والموبايل والأنظمة الخلفية والذكاء الاصطناعي — ويُصلح ما تعطّل منها.',
    eyebrow: 'عن الاستوديو',
    title: 'مهندسون ظلّوا مهندسين',
    description:
      'بدأنا عام 2017 بأعمال إنقاذ لفرقٍ تخلّت عنها شركات التطوير. وبعد تسع سنوات، ما زال المعيار كما هو: أن نبني برمجيات يتسلّمها مهندسو العميل أنفسهم عن طيب خاطر.',
  },
}

export default function AboutPage() {
  const s = useStrings(STRINGS)
  const stats = useLocalized(STATS)
  const principles = useLocalized(PRINCIPLES)

  return (
    <PageTransition>
      <Seo title={s.seoTitle} description={s.seoDescription} />

      <Section width="wide" spacing="sm" className="pt-20">
        <SectionHeading
          eyebrow={s.eyebrow}
          title={s.title}
          description={s.description}
          className="mb-16 max-w-3xl"
        />

        <dl className="grid grid-cols-2 gap-8 border-y border-line py-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06} className="flex flex-col gap-1">
              <dd className="text-[36px] font-semibold tracking-[-0.025em]">{stat.value}</dd>
              <dt className="text-[14px] text-text-subtle">{stat.label}</dt>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section width="wide" spacing="sm">
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle, index) => {
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
