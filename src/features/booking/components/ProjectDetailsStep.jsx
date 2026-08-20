import { Field, Input, Select, Textarea } from '@components/ui'
import { SERVICE_OPTIONS } from '@data/services'
import { BUDGET_RANGES, TIMELINES } from '@data/booking'

export function ProjectDetailsStep({ values, errors, setField }) {
  return (
    <div className="flex flex-col gap-6">
      <Field id="booking-service" label="What do you need?" required error={errors.service}>
        <Select
          id="booking-service"
          value={values.service}
          invalid={Boolean(errors.service)}
          onChange={(event) => setField('service', event.target.value)}
          placeholder="Choose a service"
          options={SERVICE_OPTIONS}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="booking-budget" label="Budget range" required error={errors.budget}>
          <Select
            id="booking-budget"
            value={values.budget}
            invalid={Boolean(errors.budget)}
            onChange={(event) => setField('budget', event.target.value)}
            placeholder="Select a range"
            options={BUDGET_RANGES.map(({ value, label }) => ({ value, label }))}
          />
        </Field>

        <Field id="booking-timeline" label="Ideal start" required error={errors.timeline}>
          <Select
            id="booking-timeline"
            value={values.timeline}
            invalid={Boolean(errors.timeline)}
            onChange={(event) => setField('timeline', event.target.value)}
            placeholder="Select a timeline"
            options={TIMELINES}
          />
        </Field>
      </div>

      <Field
        id="booking-message"
        label="Tell us about the project"
        required
        error={errors.message}
        hint="What are you building, what is broken, and what does done look like?"
      >
        <Textarea
          id="booking-message"
          rows={6}
          value={values.message}
          invalid={Boolean(errors.message)}
          onChange={(event) => setField('message', event.target.value)}
          placeholder="We have a React dashboard that slows to a crawl above 5k rows, and a mobile app to ship by March…"
        />
      </Field>

      <Field
        id="booking-repo"
        label="Repository or product link"
        hint="Optional — but it gets you a sharper answer."
      >
        <Input
          id="booking-repo"
          type="url"
          value={values.projectSlug}
          onChange={(event) => setField('projectSlug', event.target.value)}
          placeholder="https://github.com/acme/dashboard"
        />
      </Field>
    </div>
  )
}
