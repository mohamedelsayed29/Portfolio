import { Check } from 'lucide-react'
import { Field, Input, Select, Textarea } from '@components/ui'
import { HOW_HEARD } from '@data/booking'
import { cn } from '@lib/cn'

export function ContactStep({ values, errors, setField }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="booking-website">Website</label>
        <input
          id="booking-website"
          name="website"
          value={values.website}
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => setField('website', event.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-name" label="Your name" required error={errors.name}>
          <Input
            id="booking-name"
            value={values.name}
            invalid={Boolean(errors.name)}
            autoComplete="name"
            onChange={(event) => setField('name', event.target.value)}
            placeholder="Alex Moreau"
          />
        </Field>

        <Field id="booking-email" label="Email" required error={errors.email}>
          <Input
            id="booking-email"
            type="email"
            value={values.email}
            invalid={Boolean(errors.email)}
            autoComplete="email"
            onChange={(event) => setField('email', event.target.value)}
            placeholder="alex@company.com"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-company" label="Company" hint="Optional.">
          <Input
            id="booking-company"
            value={values.company}
            autoComplete="organization"
            onChange={(event) => setField('company', event.target.value)}
            placeholder="Acme Inc."
          />
        </Field>

        <Field id="booking-heard" label="How did you find us?">
          <Select
            id="booking-heard"
            value={values.heardFrom}
            onChange={(event) => setField('heardFrom', event.target.value)}
            placeholder="Choose one"
            options={HOW_HEARD}
          />
        </Field>
      </div>

      {values.type === 'meeting' && (
        <Field
          id="booking-agenda"
          label="Anything to read before the call?"
          hint="Optional — context means we skip the small talk."
        >
          <Textarea
            id="booking-agenda"
            rows={4}
            value={values.message}
            onChange={(event) => setField('message', event.target.value)}
            placeholder="We are deciding between fine-tuning and RAG for a support assistant…"
          />
        </Field>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={values.consent}
          onClick={() => setField('consent', !values.consent)}
          className="flex items-start gap-3 text-left"
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
          <span className="text-[14px] leading-relaxed text-text-muted">
            You can email me about this enquiry. No newsletter, no list, no follow-up sequence.
          </span>
        </button>

        {errors.consent && (
          <p role="alert" className="pl-8 text-[13px] text-danger">
            {errors.consent}
          </p>
        )}
      </div>
    </div>
  )
}
