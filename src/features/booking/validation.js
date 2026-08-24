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
 * Messages are `{ en, ar }` locale objects — the consuming hook collapses them
 * to the active language (see useBookingForm), so this module stays pure.
 */
const MESSAGES = {
  service: {
    en: 'Pick the service closest to what you need.',
    ar: 'اختر الخدمة الأقرب لما تحتاجه.',
  },
  budget: {
    en: 'A range is enough — it will not be held against you.',
    ar: 'يكفي تحديد نطاق تقريبي — ولن نحاسبك عليه لاحقًا.',
  },
  timeline: {
    en: 'Roughly when should this start?',
    ar: 'متى تودّ أن نبدأ تقريبًا؟',
  },
  message: {
    en: 'Give us at least a couple of sentences (30 characters minimum).',
    ar: 'اكتب لنا جملتين على الأقل (30 حرفًا كحد أدنى).',
  },
  date: { en: 'Choose a day.', ar: 'اختر يومًا.' },
  time: { en: 'Choose a time slot.', ar: 'اختر موعدًا.' },
  name: { en: 'Your name, please.', ar: 'نحتاج اسمك من فضلك.' },
  emailRequired: {
    en: 'We need somewhere to reply.',
    ar: 'نحتاج بريدًا إلكترونيًا للرد عليك.',
  },
  emailInvalid: {
    en: 'That does not look like an email address.',
    ar: 'هذا لا يبدو بريدًا إلكترونيًا صحيحًا.',
  },
  consent: {
    en: 'We need your permission to reply.',
    ar: 'نحتاج موافقتك حتى نتمكن من الرد عليك.',
  },
}

export function validateStep(step, values) {
  const errors = {}

  if (step === 'details') {
    if (values.type === 'project') {
      if (!values.service) errors.service = MESSAGES.service
      if (!values.budget) errors.budget = MESSAGES.budget
      if (!values.timeline) errors.timeline = MESSAGES.timeline
      if (values.message.trim().length < 30) {
        errors.message = MESSAGES.message
      }
    } else {
      if (!values.date) errors.date = MESSAGES.date
      if (!values.time) errors.time = MESSAGES.time
    }
  }

  if (step === 'contact') {
    if (!values.name.trim()) errors.name = MESSAGES.name
    if (!values.email.trim()) {
      errors.email = MESSAGES.emailRequired
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = MESSAGES.emailInvalid
    }
    if (!values.consent) errors.consent = MESSAGES.consent
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
    consent: values.consent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
