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
import { useLocalized, useStrings } from '@/i18n'

const AUDIENCES = [
  {
    icon: Sparkles,
    title: { en: 'Have a SaaS idea?', ar: 'لديك فكرة SaaS؟' },
    body: {
      en: 'We turn it into a live product: clear scope, a testable MVP, then staged growth from real market feedback.',
      ar: 'نحوّلها إلى منتج حي: نطاق واضح، ونسخة MVP قابلة للاختبار، ثم نمو تدريجي مبني على ملاحظات حقيقية من السوق.',
    },
  },
  {
    icon: Rocket,
    title: { en: 'Startups that need an MVP', ar: 'شركات ناشئة تحتاج إلى MVP' },
    body: {
      en: 'Launch the first useful version quickly without burning time on features users do not need yet.',
      ar: 'نطلق أول نسخة مفيدة بسرعة، دون إهدار الوقت على مزايا لا يحتاجها المستخدمون بعد.',
    },
  },
  {
    icon: RefreshCw,
    title: { en: 'Companies with legacy systems', ar: 'شركات لديها أنظمة قديمة' },
    body: {
      en: 'We enter existing codebases, find the root cause, and fix or refactor without reckless rewrites.',
      ar: 'نتعامل مع الكود القائم، ونصل إلى جذر المشكلة، ثم نصلح أو نعيد الهيكلة من دون إعادة كتابة متهورة.',
    },
  },
  {
    icon: HeartPulse,
    title: { en: 'Clinics and medical centers', ar: 'العيادات والمراكز الطبية' },
    body: {
      en: 'Bookings, patient files, payments, reminders, and operating dashboards that help teams serve patients better.',
      ar: 'حجوزات، وملفات مرضى، ومدفوعات، وتذكيرات، ولوحات تشغيل تساعد الفرق على خدمة المرضى بشكل أفضل.',
    },
  },
  {
    icon: Dumbbell,
    title: { en: 'Gyms and fitness centers', ar: 'الصالات الرياضية ومراكز اللياقة' },
    body: {
      en: 'Memberships, QR access, trainer bookings, branch occupancy, and mobile apps for members.',
      ar: 'اشتراكات، ودخول برمز QR، وحجز مدربين، ومتابعة إشغال الفروع، وتطبيقات موبايل للأعضاء.',
    },
  },
  {
    icon: ShoppingBag,
    title: { en: 'E-commerce teams', ar: 'فرق التجارة الإلكترونية' },
    body: {
      en: 'Arabic/English storefronts, catalogues, payments, offers, and admin tools for local and Gulf markets.',
      ar: 'متاجر بالعربية والإنجليزية، وكتالوجات، ومدفوعات، وعروض، وأدوات إدارة للأسواق المحلية والخليجية.',
    },
  },
  {
    icon: Store,
    title: { en: 'Teams that need AI automation', ar: 'فرق تحتاج إلى أتمتة بالذكاء الاصطناعي' },
    body: {
      en: 'We connect AI to your data and real workflows: RAG, summarization, agents, and repeatable automation.',
      ar: 'نربط الذكاء الاصطناعي ببياناتك وسير عملك الفعلي: RAG، والتلخيص الآلي، والوكلاء الأذكياء، والأتمتة القابلة للتكرار.',
    },
  },
  {
    icon: Building2,
    title: {
      en: 'Gulf companies needing a technical partner',
      ar: 'شركات خليجية تبحث عن شريك تقني',
    },
    body: {
      en: 'We work as an external technical team with clear communication, weekly delivery, and full ownership handover.',
      ar: 'نعمل كفريق تقني خارجي بتواصل واضح، وتسليم أسبوعي، ونقل كامل للملكية في النهاية.',
    },
  },
]

const STRINGS = {
  en: {
    eyebrow: 'Who it is for',
    title: 'We build for teams that need a real product, not just a polished screen.',
    description:
      'Whether you have a SaaS idea, an old system slowing the team down, or a workflow that needs AI automation, we help turn it into a product that can grow.',
  },
  ar: {
    eyebrow: 'لمن نعمل',
    title: 'نبني لفرقٍ تحتاج إلى منتج حقيقي، لا مجرد شاشات أنيقة.',
    description:
      'سواء كانت لديك فكرة SaaS، أو نظام قديم يبطئ فريقك، أو عمليات تحتاج إلى أتمتة بالذكاء الاصطناعي — نساعدك على تحويلها إلى منتج قادر على النمو.',
  },
}

export function AudienceSection() {
  const copy = useStrings(STRINGS)
  const audiences = useLocalized(AUDIENCES)

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
        {audiences.map((item, index) => {
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
