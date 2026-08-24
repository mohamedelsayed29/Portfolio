import { Clock, Mail, MapPin, ShieldCheck } from 'lucide-react'
import { Section } from '@components/layout'
import { Reveal } from '@components/common'
import { Card } from '@components/ui'
import { useLocalized, useStrings } from '@/i18n'
import { SITE } from '@constants/site'
import { BookingForm } from './components/BookingForm'

const STRINGS = {
  en: {
    headingLine1: "Let's get it",
    headingLine2: 'on the calendar.',
    intro:
      'Book a scoped project or a thirty-minute call. Either way you talk to the people who would write the code — there is no account manager in between.',
  },
  ar: {
    headingLine1: 'احجز موعدك،',
    headingLine2: 'ولنبدأ العمل.',
    intro:
      'احجز مشروعًا محدّد النطاق أو مكالمة مدتها ثلاثون دقيقة. في الحالتين ستتحدث مباشرةً مع من سيكتبون الكود بأنفسهم — لا مدير حسابات بينكما.',
  },
}

const ASSURANCES = [
  {
    icon: Clock,
    title: { en: 'Answered within a day', ar: 'نرد خلال يوم واحد' },
    body: {
      en: 'A real person reads every request. Median first response is under 24 hours on weekdays.',
      ar: 'شخص حقيقي يقرأ كل طلب. متوسط زمن أول رد أقل من 24 ساعة في أيام العمل.',
    },
  },
  {
    icon: ShieldCheck,
    title: { en: 'No sales pipeline', ar: 'بلا مسار مبيعات' },
    body: {
      en: 'One reply, then a scope or an honest "not us". Your address never enters a mailing list.',
      ar: 'رد واحد، يليه نطاق مكتوب أو اعتذار صريح بأننا لسنا الأنسب. بريدك لن يدخل أي قائمة مراسلات.',
    },
  },
  {
    icon: Mail,
    title: { en: 'Prefer plain email?', ar: 'تفضّل البريد الإلكتروني مباشرةً؟' },
    body: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: MapPin,
    title: { en: 'Where we are', ar: 'أين نحن' },
    body: SITE.location,
  },
]

/** The full booking experience used on /book — form plus the reassurance column. */
export function BookingSection({ initialValues = {} }) {
  const s = useStrings(STRINGS)
  const assurances = useLocalized(ASSURANCES)

  return (
    <Section id="book" width="wide" spacing="sm">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8">
          <Reveal>
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-semibold">
              {s.headingLine1}
              <br />
              {s.headingLine2}
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-text-muted">{s.intro}</p>
          </Reveal>

          <ul className="flex flex-col gap-5">
            {assurances.map((item, index) => {
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
