import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

const INITIAL = { open: false, type: 'meeting', service: '', projectSlug: '' }

/**
 * Lets any component anywhere open the booking dialog pre-filled — a service
 * card can request "project + ai", a project page can attach its own slug —
 * without prop-drilling the form state through the tree.
 */
export function BookingProvider({ children }) {
  const [state, setState] = useState(INITIAL)

  const openBooking = useCallback((options = {}) => {
    setState({ ...INITIAL, ...options, open: true })
  }, [])

  const closeBooking = useCallback(() => {
    setState((current) => ({ ...current, open: false }))
  }, [])

  const value = useMemo(
    () => ({ ...state, openBooking, closeBooking }),
    [state, openBooking, closeBooking],
  )

  return <BookingContext value={value}>{children}</BookingContext>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used inside <BookingProvider>')
  return context
}
