import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CircleAlert, Send } from 'lucide-react'
import { Button } from '@components/ui'
import { EASE_APPLE } from '@lib/animations'
import { useBookingForm } from '../hooks/useBookingForm'
import { BookingTypeToggle } from './BookingTypeToggle'
import { StepIndicator } from './StepIndicator'
import { SlotPicker } from './SlotPicker'
import { ProjectDetailsStep } from './ProjectDetailsStep'
import { ContactStep } from './ContactStep'
import { BookingSuccess } from './BookingSuccess'

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: EASE_APPLE },
}

export function BookingForm({ initialValues = {}, onDone }) {
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
          <span className="text-[13px] text-text-subtle">Takes about a minute.</span>
        ) : (
          <Button type="button" variant="ghost" onClick={goBack} icon={ArrowLeft} iconPosition="left">
            Back
          </Button>
        )}

        <Button
          type="submit"
          size="md"
          loading={status === 'submitting'}
          icon={isLastStep ? Send : ArrowRight}
        >
          {isLastStep ? 'Send request' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
