import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Button } from '@components/ui'
import { useLocalized, useStrings } from '@/i18n'
import { EASE_APPLE } from '@lib/animations'
import { getServiceById } from '@data/services'
import { SITE } from '@constants/site'

const STRINGS = {
  en: {
    heading: 'Request received',
    bodyMeeting: (email) =>
      `Your call request has been received. We will get back to you shortly at ${email}.`,
    bodyProject: (email) =>
      `Your project request has been received. We will get back to you shortly at ${email}.`,
    reference: 'Reference',
    service: 'Service',
    duration: 'Duration',
    minutes: (count) => `${count} minutes`,
    questions: 'Questions',
    bookAnother: 'Book something else',
    done: 'Done',
  },
  ar: {
    heading: 'استلمنا طلبك',
    bodyMeeting: (email) => `وصلنا طلب مكالمتك، وسنعود إليك قريبًا على ${email}.`,
    bodyProject: (email) => `وصلنا طلب مشروعك، وسنعود إليك قريبًا على ${email}.`,
    reference: 'رقم المرجع',
    service: 'الخدمة',
    duration: 'المدة',
    minutes: (count) => `${count} دقيقة`,
    questions: 'للاستفسارات',
    bookAnother: 'احجز مرة أخرى',
    done: 'تم',
  },
}

export function BookingSuccess({ result, onReset, onDone }) {
  const s = useStrings(STRINGS)
  const service = useLocalized(getServiceById(result?.service))

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_APPLE }}
        className="relative grid size-16 place-items-center rounded-full bg-success/12 text-success"
      >
        <motion.span
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut', repeat: 1 }}
          className="absolute inset-0 rounded-full bg-success/25"
        />
        <Check size={28} aria-hidden="true" />
      </motion.span>

      <div className="flex flex-col gap-2">
        <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{s.heading}</h3>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-text-muted">
          {result?.type === 'meeting'
            ? s.bodyMeeting(result?.email)
            : s.bodyProject(result?.email)}
        </p>
      </div>

      <dl className="grid w-full max-w-sm gap-px overflow-hidden rounded-[var(--radius-apple)] border border-line bg-line text-start">
        <div className="flex items-center justify-between bg-surface px-4 py-3">
          <dt className="text-[13px] text-text-subtle">{s.reference}</dt>
          <dd className="font-mono text-[13px] font-medium">{result?.reference}</dd>
        </div>
        {service && (
          <div className="flex items-center justify-between bg-surface px-4 py-3">
            <dt className="text-[13px] text-text-subtle">{s.service}</dt>
            <dd className="text-[13px] font-medium">{service.title}</dd>
          </div>
        )}
        {result?.duration && (
          <div className="flex items-center justify-between bg-surface px-4 py-3">
            <dt className="text-[13px] text-text-subtle">{s.duration}</dt>
            <dd className="text-[13px] font-medium">{s.minutes(result.duration)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between bg-surface px-4 py-3">
          <dt className="text-[13px] text-text-subtle">{s.questions}</dt>
          <dd className="text-[13px] font-medium">
            <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
              {SITE.email}
            </a>
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={onReset}>
          {s.bookAnother}
        </Button>
        {onDone && <Button onClick={onDone}>{s.done}</Button>}
      </div>
    </div>
  )
}
