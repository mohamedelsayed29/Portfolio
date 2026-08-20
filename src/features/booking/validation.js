const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const INITIAL_VALUES = {
  type: 'meeting',
  // Project branch
  service: '',
  budget: '',
  timeline: '',
  message: '',
  // Meeting branch
  date: '',
  time: '',
  duration: '30',
  // Shared
  name: '',
  email: '',
  company: '',
  heardFrom: '',
  consent: false,
  projectSlug: '',
}

/**
 * Per-step validation. Returning a plain object of field → message keeps this
 * free of any form library while still supporting step-gated submission.
 */
export function validateStep(step, values) {
  const errors = {}

  if (step === 'details') {
    if (values.type === 'project') {
      if (!values.service) errors.service = 'Pick the service closest to what you need.'
      if (!values.budget) errors.budget = 'A range is enough — it will not be held against you.'
      if (!values.timeline) errors.timeline = 'Roughly when should this start?'
      if (values.message.trim().length < 30) {
        errors.message = 'Give us at least a couple of sentences (30 characters minimum).'
      }
    } else {
      if (!values.date) errors.date = 'Choose a day.'
      if (!values.time) errors.time = 'Choose a time slot.'
    }
  }

  if (step === 'contact') {
    if (!values.name.trim()) errors.name = 'Your name, please.'
    if (!values.email.trim()) {
      errors.email = 'We need somewhere to reply.'
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = 'That does not look like an email address.'
    }
    if (!values.consent) errors.consent = 'We need your permission to reply.'
  }

  return errors
}

export const isStepValid = (step, values) => Object.keys(validateStep(step, values)).length === 0

/** Strips the branch that does not apply before the request goes out. */
export function toBookingPayload(values) {
  const shared = {
    type: values.type,
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    heardFrom: values.heardFrom,
    projectSlug: values.projectSlug || undefined,
  }

  if (values.type === 'project') {
    return {
      ...shared,
      service: values.service,
      budget: values.budget,
      timeline: values.timeline,
      message: values.message.trim(),
    }
  }

  return {
    ...shared,
    date: values.date,
    time: values.time,
    duration: Number(values.duration),
    message: values.message.trim(),
  }
}
