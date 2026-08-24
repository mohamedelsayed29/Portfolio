import { Field, Input, Select, Textarea } from '@components/ui'
import { useLocalized, useStrings } from '@/i18n'
import { SERVICE_OPTIONS } from '@data/services'
import { BUDGET_RANGES, TIMELINES } from '@data/booking'

const STRINGS = {
  en: {
    serviceLabel: 'What do you need?',
    servicePlaceholder: 'Choose a service',
    budgetLabel: 'Budget range',
    budgetPlaceholder: 'Select a range',
    timelineLabel: 'Ideal start',
    timelinePlaceholder: 'Select a timeline',
    messageLabel: 'Tell us about the project',
    messageHint: 'What are you building, what is broken, and what does done look like?',
    messagePlaceholder:
      'We have a React dashboard that slows to a crawl above 5k rows, and a mobile app to ship by March…',
    repoLabel: 'Repository or product link',
    repoHint: 'Optional — but it gets you a sharper answer.',
    repoPlaceholder: 'https://github.com/acme/dashboard',
  },
  ar: {
    serviceLabel: 'ما الذي تحتاجه؟',
    servicePlaceholder: 'اختر خدمة',
    budgetLabel: 'نطاق الميزانية',
    budgetPlaceholder: 'اختر نطاقًا',
    timelineLabel: 'موعد البدء المفضّل',
    timelinePlaceholder: 'اختر إطارًا زمنيًا',
    messageLabel: 'حدّثنا عن المشروع',
    messageHint: 'ما الذي تبنيه؟ ما المشكلة القائمة؟ وكيف يبدو الإنجاز المطلوب في نظرك؟',
    messagePlaceholder:
      'لدينا لوحة تحكم React تتباطأ بشدة عند تجاوز 5 آلاف صف، وتطبيق موبايل يجب إطلاقه قبل مارس…',
    repoLabel: 'رابط المستودع أو المنتج',
    repoHint: 'اختياري — لكنه يساعدنا على إعطائك إجابة أدق.',
    repoPlaceholder: 'https://github.com/acme/dashboard',
  },
}

export function ProjectDetailsStep({ values, errors, setField }) {
  const s = useStrings(STRINGS)
  const serviceOptions = useLocalized(SERVICE_OPTIONS)
  const budgetOptions = useLocalized(BUDGET_RANGES)
  const timelineOptions = useLocalized(TIMELINES)

  return (
    <div className="flex flex-col gap-6">
      <Field id="booking-service" label={s.serviceLabel} required error={errors.service}>
        <Select
          id="booking-service"
          value={values.service}
          invalid={Boolean(errors.service)}
          onChange={(event) => setField('service', event.target.value)}
          placeholder={s.servicePlaceholder}
          options={serviceOptions}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-budget" label={s.budgetLabel} required error={errors.budget}>
          <Select
            id="booking-budget"
            value={values.budget}
            invalid={Boolean(errors.budget)}
            onChange={(event) => setField('budget', event.target.value)}
            placeholder={s.budgetPlaceholder}
            options={budgetOptions.map(({ value, label }) => ({ value, label }))}
          />
        </Field>

        <Field id="booking-timeline" label={s.timelineLabel} required error={errors.timeline}>
          <Select
            id="booking-timeline"
            value={values.timeline}
            invalid={Boolean(errors.timeline)}
            onChange={(event) => setField('timeline', event.target.value)}
            placeholder={s.timelinePlaceholder}
            options={timelineOptions}
          />
        </Field>
      </div>

      <Field
        id="booking-message"
        label={s.messageLabel}
        required
        error={errors.message}
        hint={s.messageHint}
      >
        <Textarea
          id="booking-message"
          rows={6}
          value={values.message}
          invalid={Boolean(errors.message)}
          onChange={(event) => setField('message', event.target.value)}
          placeholder={s.messagePlaceholder}
        />
      </Field>

      <Field id="booking-repo" label={s.repoLabel} hint={s.repoHint}>
        {/* URLs are Latin text: keep the field LTR so the value does not
            jumble when the page is RTL. */}
        <Input
          id="booking-repo"
          type="url"
          dir="ltr"
          className="text-left"
          value={values.projectSlug}
          onChange={(event) => setField('projectSlug', event.target.value)}
          placeholder={s.repoPlaceholder}
        />
      </Field>
    </div>
  )
}
