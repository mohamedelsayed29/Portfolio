import { Modal } from '@components/ui'
import { useBooking } from '@app/providers'
import { useStrings } from '@/i18n'
import { BookingForm } from './components/BookingForm'

const STRINGS = {
  en: {
    projectTitle: 'Book a project',
    projectDescription: 'Three short steps. You get a written scope back, not a sales call.',
    meetingTitle: 'Book a meeting',
    meetingDescription: 'Pick a slot that works and send us the details.',
  },
  ar: {
    projectTitle: 'احجز مشروعًا',
    projectDescription: 'ثلاث خطوات قصيرة، وستصلك خطة نطاق مكتوبة — لا مكالمة مبيعات.',
    meetingTitle: 'احجز مكالمة',
    meetingDescription: 'اختر الموعد الذي يناسبك وأرسل لنا التفاصيل.',
  },
}

/**
 * The globally mounted booking modal. Any component can open it pre-filled
 * through `useBooking().openBooking({ type, service })`.
 */
export function BookingDialog() {
  const s = useStrings(STRINGS)
  const { open, closeBooking, type, service, projectSlug } = useBooking()

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={closeBooking}
      title={type === 'project' ? s.projectTitle : s.meetingTitle}
      description={type === 'project' ? s.projectDescription : s.meetingDescription}
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
