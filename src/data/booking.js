import { Briefcase, Video } from 'lucide-react'

/** The two things a visitor can book. Drives the toggle at the top of the form. */
export const BOOKING_TYPES = [
  {
    id: 'project',
    icon: Briefcase,
    label: 'Book a project',
    tagline: 'Scoped delivery work',
    description:
      'Tell us what you need built or fixed. You get a written scope and a start date, usually within four days.',
  },
  {
    id: 'meeting',
    icon: Video,
    label: 'Book a meeting',
    tagline: '30-minute intro call',
    description:
      'Pick a slot and talk to the people who would do the work. No sales deck, no obligation.',
  },
]

export const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000', min: 0, max: 5000 },
  { value: '5k-15k', label: '$5,000 – $15,000', min: 5000, max: 15000 },
  { value: '15k-40k', label: '$15,000 – $40,000', min: 15000, max: 40000 },
  { value: '40k-100k', label: '$40,000 – $100,000', min: 40000, max: 100000 },
  { value: '100k-plus', label: '$100,000+', min: 100000, max: null },
  { value: 'unsure', label: 'Not sure yet', min: null, max: null },
]

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within a month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'exploring', label: 'Just exploring' },
]

export const MEETING_DURATIONS = [
  { value: '30', label: '30 min — Intro call' },
  { value: '60', label: '60 min — Deep dive' },
  { value: '90', label: '90 min — Technical audit' },
]

/** Local working hours offered to visitors; filtered per-day by the slot builder. */
export const MEETING_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '11:00',
  '13:00',
  '13:30',
  '14:00',
  '15:00',
  '16:00',
  '16:30',
]

export const HOW_HEARD = [
  { value: 'search', label: 'Search' },
  { value: 'referral', label: 'A referral' },
  { value: 'social', label: 'Social' },
  { value: 'event', label: 'A conference or event' },
  { value: 'other', label: 'Somewhere else' },
]
