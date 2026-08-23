import { Modal } from '@components/ui'
import { useBooking } from '@app/providers'
import { BookingForm } from './components/BookingForm'

/**
 * The globally mounted booking modal. Any component can open it pre-filled
 * through `useBooking().openBooking({ type, service })`.
 */
export function BookingDialog() {
  const { open, closeBooking, type, service, projectSlug } = useBooking()

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={closeBooking}
      title={type === 'project' ? 'Book a project' : 'Book a meeting'}
      description={
        type === 'project'
          ? 'Three short steps. You get a written scope back, not a sales call.'
          : 'Pick a slot that works and send us the details.'
      }
      className="max-w-2xl"
    >
      <BookingForm
        key={`${type}-${service}`}
        initialValues={{ type, service, projectSlug }}
        onDone={closeBooking}
      />
    </Modal>
  )
}
