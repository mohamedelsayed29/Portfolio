import { useCallback, useMemo, useRef, useState } from 'react'
import { createBooking } from '../api/bookingApi'
import { INITIAL_VALUES, toBookingPayload, validateStep } from '../validation'

export const STEPS = ['type', 'details', 'contact']

const STEP_LABELS = {
  type: 'Engagement',
  details: 'Details',
  contact: 'Contact',
}

/**
 * Owns the whole booking flow: step position, field state, per-step validation
 * and submission. Errors only surface after a field has been touched or after
 * an attempt to advance, so the form never scolds someone mid-typing.
 */
export function useBookingForm(overrides = {}) {
  const [values, setValues] = useState({ ...INITIAL_VALUES, ...overrides })
  const [touched, setTouched] = useState({})
  const [stepIndex, setStepIndex] = useState(overrides.type ? 1 : 0)
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)
  const submittingRef = useRef(false)

  const step = STEPS[stepIndex]
  const stepErrors = useMemo(() => validateStep(step, values), [step, values])

  const visibleErrors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(stepErrors).filter(([field]) => touched[field] || touched.__step),
    )
  }, [stepErrors, touched])

  const setField = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setTouched((current) => ({ ...current, [field]: true }))
  }, [])

  /**
   * Sets a value without marking it touched — used when one control resets a
   * dependent field (picking a new day clears the time). Marking it touched
   * would surface "choose a time" before the user has had the chance to.
   */
  const clearField = useCallback((field, value = '') => {
    setValues((current) => ({ ...current, [field]: value }))
    setTouched((current) => {
      const { [field]: _removed, __step: _step, ...rest } = current
      return rest
    })
  }, [])

  const setType = useCallback((type) => {
    setValues((current) => ({ ...current, type }))
    setTouched({})
  }, [])

  const goNext = useCallback(() => {
    if (Object.keys(validateStep(STEPS[stepIndex], values)).length > 0) {
      setTouched((current) => ({ ...current, __step: true }))
      return false
    }
    setTouched({})
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1))
    return true
  }, [stepIndex, values])

  const goBack = useCallback(() => {
    setTouched({})
    setStepIndex((index) => Math.max(index - 1, 0))
  }, [])

  const submit = useCallback(async () => {
    if (submittingRef.current) return

    const errors = validateStep('contact', values)
    if (Object.keys(errors).length > 0) {
      setTouched((current) => ({ ...current, __step: true }))
      return
    }

    setStatus('submitting')
    setSubmitError(null)
    submittingRef.current = true

    try {
      const response = await createBooking(toBookingPayload(values))
      setResult(response)
      setStatus('success')
    } catch (error) {
      setSubmitError(error.message ?? 'We could not send your request. Please try again.')
      setStatus('error')
    } finally {
      submittingRef.current = false
    }
  }, [values])

  const reset = useCallback(
    (nextOverrides = {}) => {
      setValues({ ...INITIAL_VALUES, ...overrides, ...nextOverrides })
      setTouched({})
      setStepIndex(0)
      setStatus('idle')
      setSubmitError(null)
      setResult(null)
      submittingRef.current = false
    },
    [overrides],
  )

  return {
    values,
    errors: visibleErrors,
    setField,
    clearField,
    setType,
    step,
    stepIndex,
    stepLabel: STEP_LABELS[step],
    steps: STEPS,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === STEPS.length - 1,
    canAdvance: Object.keys(stepErrors).length === 0,
    goNext,
    goBack,
    submit,
    reset,
    status,
    submitError,
    result,
  }
}
