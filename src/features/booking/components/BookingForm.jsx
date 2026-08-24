import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CircleAlert, Send } from 'lucide-react'
import { Button } from '@components/ui'
import { useLanguage, useStrings } from '@/i18n'
import { EASE_APPLE } from '@lib/animations'
import { useBookingForm } from '../hooks/useBookingForm'
import { BookingTypeToggle } from './BookingTypeToggle'
import { StepIndicator } from './StepIndicator'
import { SlotPicker } from './SlotPicker'
import { ProjectDetailsStep } from './ProjectDetailsStep'
import { ContactStep } from './ContactStep'
import { BookingSuccess } from './BookingSuccess'

const STRINGS = {
  en: {
    takesAMinute: 'Takes about a minute.',
    back: 'Back',
    continue: 'Continue',
    sendRequest: 'Send request',
  },
  ar: {
    takesAMinute: 'لن يستغرق الأمر أكثر من دقيقة.',
    back: 'رجوع',
    continue: 'متابعة',
    sendRequest: 'أرسل الطلب',
  },
}

/* Button renders its icon internally, so the paper plane mirrors via a wrapped
   component instead of a className on the call site. */
const SendIcon = (props) => <Send className="rtl:-scale-x-100" {...props} />

export function BookingForm({ initialValues = {}, onDone }) {
  const s = useStrings(STRINGS)
  const { isRTL } = useLanguage()
  const form = useBookingForm(initialValues)
  const {
    values,
    errors,
    setField,
    clearField,
    setType,
    step,
    stepIndex,
    steps,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    submit,
    reset,
    status,
    submitError,
    result,
  } = form

  if (status === 'success') {
    return <BookingSuccess result={result} onReset={() => reset()} onDone={onDone} />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isLastStep) {
      submit()
    } else {
      goNext()
    }
  }

  // Steps advance with the reading direction: new content slides in from the
  // "next" side, which is the left in RTL.
  const stepMotion = {
    initial: { opacity: 0, x: isRTL ? -24 : 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 24 : -24 },
    transition: { duration: 0.35, ease: EASE_APPLE },
  }

  // The arrows must point "back" and "forward" in reading order, so the two
  // glyphs swap roles in RTL.
  const BackIcon = isRTL ? ArrowRight : ArrowLeft
  const ForwardIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-w-0 flex-col gap-8">
      <StepIndicator steps={steps} currentIndex={stepIndex} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} {...stepMotion} className="min-w-0">
          {step === 'type' && <BookingTypeToggle value={values.type} onChange={setType} />}

          {step === 'details' &&
            (values.type === 'project' ? (
              <ProjectDetailsStep values={values} errors={errors} setField={setField} />
            ) : (
              <SlotPicker
                values={values}
                errors={errors}
                setField={setField}
                clearField={clearField}
              />
            ))}

          {step === 'contact' && (
            <ContactStep values={values} errors={errors} setField={setField} />
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[14px] bg-danger/10 px-4 py-3 text-[14px] text-danger"
        >
          <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        {isFirstStep ? (
          <span className="text-[13px] text-text-subtle">{s.takesAMinute}</span>
        ) : (
          <Button type="button" variant="ghost" onClick={goBack} icon={BackIcon} iconPosition="left">
            {s.back}
          </Button>
        )}

        <Button
          type="submit"
          size="md"
          loading={status === 'submitting'}
          icon={isLastStep ? SendIcon : ForwardIcon}
        >
          {isLastStep ? s.sendRequest : s.continue}
        </Button>
      </div>
    </form>
  )
}
