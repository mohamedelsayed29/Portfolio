import { Briefcase, Video } from 'lucide-react'

/** The two things a visitor can book. Drives the toggle at the top of the form. */
export const BOOKING_TYPES = [
  {
    id: 'project',
    icon: Briefcase,
    label: { en: 'Book a project', ar: 'احجز مشروعًا' },
    tagline: { en: 'Scoped delivery work', ar: 'تنفيذ محدّد النطاق' },
    description: {
      en: 'Tell us what you need built or fixed. You get a written scope and a start date, usually within four days.',
      ar: 'أخبرنا بما تريد بناءه أو إصلاحه، وستصلك خطة نطاق مكتوبة وموعد بدء واضح — خلال أربعة أيام غالبًا.',
    },
  },
  {
    id: 'meeting',
    icon: Video,
    label: { en: 'Book a meeting', ar: 'احجز مكالمة' },
    tagline: { en: '30-minute intro call', ar: 'مكالمة تعارف مدتها 30 دقيقة' },
    description: {
      en: 'Pick a slot and talk to the people who would do the work. No sales deck, no obligation.',
      ar: 'اختر موعدًا وتحدّث مباشرةً مع من سينفّذون العمل بأنفسهم — بلا عروض مبيعات ولا أي التزام.',
    },
  },
]

export const BUDGET_RANGES = [
  { value: 'under-5k', label: { en: 'Under $5,000', ar: 'أقل من 5,000 دولار' }, min: 0, max: 5000 },
  {
    value: '5k-15k',
    label: { en: '$5,000 – $15,000', ar: '5,000 – 15,000 دولار' },
    min: 5000,
    max: 15000,
  },
  {
    value: '15k-40k',
    label: { en: '$15,000 – $40,000', ar: '15,000 – 40,000 دولار' },
    min: 15000,
    max: 40000,
  },
  {
    value: '40k-100k',
    label: { en: '$40,000 – $100,000', ar: '40,000 – 100,000 دولار' },
    min: 40000,
    max: 100000,
  },
  {
    value: '100k-plus',
    label: { en: '$100,000+', ar: 'أكثر من 100,000 دولار' },
    min: 100000,
    max: null,
  },
  { value: 'unsure', label: { en: 'Not sure yet', ar: 'لم نحدّد بعد' }, min: null, max: null },
]

export const TIMELINES = [
  { value: 'asap', label: { en: 'As soon as possible', ar: 'في أقرب وقت ممكن' } },
  { value: '1-month', label: { en: 'Within a month', ar: 'خلال شهر' } },
  { value: 'quarter', label: { en: 'This quarter', ar: 'خلال هذا الربع من السنة' } },
  { value: 'exploring', label: { en: 'Just exploring', ar: 'ما زلنا نستكشف الخيارات' } },
]

export const MEETING_DURATIONS = [
  { value: '30', label: { en: '30 min — Intro call', ar: '30 دقيقة — مكالمة تعارف' } },
  { value: '60', label: { en: '60 min — Deep dive', ar: '60 دقيقة — نقاش متعمّق' } },
  { value: '90', label: { en: '90 min — Technical audit', ar: '90 دقيقة — مراجعة تقنية' } },
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
  { value: 'search', label: { en: 'Search', ar: 'البحث على الإنترنت' } },
  { value: 'referral', label: { en: 'A referral', ar: 'ترشيح من أحد معارفي' } },
  { value: 'social', label: { en: 'Social', ar: 'وسائل التواصل الاجتماعي' } },
  { value: 'event', label: { en: 'A conference or event', ar: 'مؤتمر أو فعالية' } },
  { value: 'other', label: { en: 'Somewhere else', ar: 'مكان آخر' } },
]
