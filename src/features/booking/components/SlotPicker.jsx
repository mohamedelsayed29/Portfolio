import { motion } from 'motion/react'
import { CalendarCheck } from 'lucide-react'
import { Field, Select, Spinner } from '@components/ui'
import { MEETING_DURATIONS } from '@data/booking'
import { formatDayLabel } from '@lib/format'
import { cn } from '@lib/cn'
import { EASE_APPLE } from '@lib/animations'
import { useAvailability } from '../hooks/useAvailability'

export function SlotPicker({ values, errors, setField, clearField }) {
  const { availability, loading, error } = useAvailability(true, 10)
  const activeDay = availability.find((day) => day.iso === values.date)

  if (loading) {
    return (
      <div className="grid place-items-center gap-3 py-16">
        <Spinner size={22} label="Loading availability" />
        <p className="text-[13px] text-text-subtle">Checking the calendar…</p>
      </div>
    )
  }

  if (error) {
    return (
      <p role="alert" className="rounded-[14px] bg-danger/10 p-4 text-[14px] text-danger">
        {error}
      </p>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <Field
        id="booking-date"
        label="Pick a day"
        error={errors.date}
        hint="Weekdays only, times shown in your local timezone."
      >
        <div
          id="booking-date"
          role="radiogroup"
          aria-label="Available days"
          className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {availability.map((day) => {
            const selected = day.iso === values.date
            const openCount = day.slots.filter((slot) => slot.available).length

            return (
              <button
                key={day.iso}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setField('date', day.iso)
                  // Quietly, so the time error does not fire before they can pick.
                  clearField('time')
                }}
                className={cn(
                  'flex min-w-[104px] shrink-0 flex-col gap-1 rounded-[14px] border px-4 py-3 text-left',
                  'transition-all duration-300 ease-[var(--ease-apple)]',
                  selected
                    ? 'border-accent bg-accent text-accent-contrast'
                    : 'border-line bg-surface hover:border-line-strong hover:bg-surface-muted',
                )}
              >
                <span className="text-[13px] font-medium">{formatDayLabel(day.date)}</span>
                <span
                  className={cn(
                    'text-[11px]',
                    selected ? 'text-accent-contrast/75' : 'text-text-subtle',
                  )}
                >
                  {openCount} slots
                </span>
              </button>
            )
          })}
        </div>
      </Field>

      {activeDay && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_APPLE }}
        >
          <Field id="booking-time" label="Pick a time" error={errors.time}>
            <div
              role="radiogroup"
              aria-label="Available times"
              className="grid grid-cols-3 gap-2 sm:grid-cols-5"
            >
              {activeDay.slots.map((slot) => {
                const selected = values.time === slot.time

                return (
                  <button
                    key={slot.time}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!slot.available}
                    onClick={() => setField('time', slot.time)}
                    className={cn(
                      'rounded-[12px] border py-2.5 text-[13px] font-medium tabular-nums',
                      'transition-all duration-250 ease-[var(--ease-apple)]',
                      !slot.available && 'cursor-not-allowed text-text-subtle line-through opacity-40',
                      selected
                        ? 'border-accent bg-accent text-accent-contrast'
                        : 'border-line bg-surface hover:border-accent/50',
                    )}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </Field>
        </motion.div>
      )}

      <Field id="booking-duration" label="How long do you need?">
        <Select
          id="booking-duration"
          value={values.duration}
          onChange={(event) => setField('duration', event.target.value)}
          options={MEETING_DURATIONS}
        />
      </Field>

      {values.date && values.time && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 rounded-[14px] bg-success/10 px-4 py-3 text-[13px] text-success"
        >
          <CalendarCheck size={15} aria-hidden="true" />
          Holding {formatDayLabel(values.date)} at {values.time} for {values.duration} minutes.
        </motion.p>
      )}
    </div>
  )
}
