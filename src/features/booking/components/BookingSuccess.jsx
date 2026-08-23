import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Button } from '@components/ui'
import { EASE_APPLE } from '@lib/animations'
import { getServiceById } from '@data/services'
import { SITE } from '@constants/site'

export function BookingSuccess({ result, onReset, onDone }) {
  const service = getServiceById(result?.service)

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
        <h3 className="text-[26px] font-semibold tracking-[-0.02em]">Request received</h3>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-text-muted">
          {result?.type === 'meeting' ? 'Your call request' : 'Your project request'} has been
          received. We will get back to you shortly at {result?.email}.
        </p>
      </div>

      <dl className="grid w-full max-w-sm gap-px overflow-hidden rounded-[var(--radius-apple)] border border-line bg-line text-left">
        <div className="flex items-center justify-between bg-surface px-4 py-3">
          <dt className="text-[13px] text-text-subtle">Reference</dt>
          <dd className="font-mono text-[13px] font-medium">{result?.reference}</dd>
        </div>
        {service && (
          <div className="flex items-center justify-between bg-surface px-4 py-3">
            <dt className="text-[13px] text-text-subtle">Service</dt>
            <dd className="text-[13px] font-medium">{service.title}</dd>
          </div>
        )}
        {result?.duration && (
          <div className="flex items-center justify-between bg-surface px-4 py-3">
            <dt className="text-[13px] text-text-subtle">Duration</dt>
            <dd className="text-[13px] font-medium">{result.duration} minutes</dd>
          </div>
        )}
        <div className="flex items-center justify-between bg-surface px-4 py-3">
          <dt className="text-[13px] text-text-subtle">Questions</dt>
          <dd className="text-[13px] font-medium">
            <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
              {SITE.email}
            </a>
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="secondary" onClick={onReset}>
          Book something else
        </Button>
        {onDone && <Button onClick={onDone}>Done</Button>}
      </div>
    </div>
  )
}
