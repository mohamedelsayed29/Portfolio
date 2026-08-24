import { Check } from 'lucide-react'
import { Field, Input, Select, Textarea } from '@components/ui'
import { useLocalized, useStrings } from '@/i18n'
import { HOW_HEARD } from '@data/booking'
import { cn } from '@lib/cn'

const STRINGS = {
  en: {
    nameLabel: 'Your name',
    namePlaceholder: 'Alex Moreau',
    emailLabel: 'Email',
    emailPlaceholder: 'alex@company.com',
    companyLabel: 'Company',
    companyHint: 'Optional.',
    companyPlaceholder: 'Acme Inc.',
    heardLabel: 'How did you find us?',
    heardPlaceholder: 'Choose one',
    agendaLabel: 'Anything to read before the call?',
    agendaHint: 'Optional — context means we skip the small talk.',
    agendaPlaceholder: 'We are deciding between fine-tuning and RAG for a support assistant…',
    consent: 'You can email me about this enquiry. No newsletter, no list, no follow-up sequence.',
  },
  ar: {
    nameLabel: 'اسمك',
    namePlaceholder: 'أحمد عبد الرحمن',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'ahmed@company.com',
    companyLabel: 'الشركة',
    companyHint: 'اختياري.',
    companyPlaceholder: 'شركة النيل للتقنية',
    heardLabel: 'كيف وصلت إلينا؟',
    heardPlaceholder: 'اختر إجابة',
    agendaLabel: 'هل من شيء نطّلع عليه قبل المكالمة؟',
    agendaHint: 'اختياري — كلما عرفنا السياق مسبقًا، دخلنا في صلب الموضوع مباشرة.',
    agendaPlaceholder: 'نحاول الاختيار بين الضبط الدقيق (fine-tuning) وتقنية RAG لبناء مساعد دعم فني…',
    consent:
      'أوافق على مراسلتي عبر البريد الإلكتروني بخصوص هذا الطلب — دون نشرات بريدية أو قوائم مراسلة أو رسائل متابعة.',
  },
}

export function ContactStep({ values, errors, setField }) {
  const s = useStrings(STRINGS)
  const howHeardOptions = useLocalized(HOW_HEARD)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-name" label={s.nameLabel} required error={errors.name}>
          <Input
            id="booking-name"
            value={values.name}
            invalid={Boolean(errors.name)}
            autoComplete="name"
            onChange={(event) => setField('name', event.target.value)}
            placeholder={s.namePlaceholder}
          />
        </Field>

        <Field id="booking-email" label={s.emailLabel} required error={errors.email}>
          {/* Email addresses are Latin text: keep the field LTR so the value
              does not jumble when the page is RTL. */}
          <Input
            id="booking-email"
            type="email"
            dir="ltr"
            className="text-left"
            value={values.email}
            invalid={Boolean(errors.email)}
            autoComplete="email"
            onChange={(event) => setField('email', event.target.value)}
            placeholder={s.emailPlaceholder}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-company" label={s.companyLabel} hint={s.companyHint}>
          <Input
            id="booking-company"
            value={values.company}
            autoComplete="organization"
            onChange={(event) => setField('company', event.target.value)}
            placeholder={s.companyPlaceholder}
          />
        </Field>

        <Field id="booking-heard" label={s.heardLabel}>
          <Select
            id="booking-heard"
            value={values.heardFrom}
            onChange={(event) => setField('heardFrom', event.target.value)}
            placeholder={s.heardPlaceholder}
            options={howHeardOptions}
          />
        </Field>
      </div>

      {values.type === 'meeting' && (
        <Field id="booking-agenda" label={s.agendaLabel} hint={s.agendaHint}>
          <Textarea
            id="booking-agenda"
            rows={4}
            value={values.message}
            onChange={(event) => setField('message', event.target.value)}
            placeholder={s.agendaPlaceholder}
          />
        </Field>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={values.consent}
          onClick={() => setField('consent', !values.consent)}
          className="flex items-start gap-3 text-start"
        >
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center rounded-[7px] border',
              'transition-all duration-250 ease-[var(--ease-apple)]',
              values.consent
                ? 'border-accent bg-accent text-accent-contrast'
                : errors.consent
                  ? 'border-danger'
                  : 'border-line-strong',
            )}
          >
            {values.consent && <Check size={13} aria-hidden="true" />}
          </span>
          <span className="text-[14px] leading-relaxed text-text-muted">{s.consent}</span>
        </button>

        {errors.consent && (
          <p role="alert" className="ps-8 text-[13px] text-danger">
            {errors.consent}
          </p>
        )}
      </div>
    </div>
  )
}
