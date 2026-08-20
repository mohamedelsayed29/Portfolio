import { useSearchParams } from 'react-router-dom'
import { Seo, PageTransition } from '@components/common'
import { BookingSection } from '@features/booking'
import { FaqSection } from '@features/contact'
import { getServiceById } from '@data/services'

const VALID_TYPES = new Set(['project', 'meeting'])

/**
 * /book?type=project&service=ai — deep links from the footer, service cards and
 * marketing emails land pre-filled instead of on a blank form.
 */
export default function BookingPage() {
  const [searchParams] = useSearchParams()

  const typeParam = searchParams.get('type')
  const serviceParam = searchParams.get('service')

  const initialValues = {}
  if (VALID_TYPES.has(typeParam)) initialValues.type = typeParam
  if (getServiceById(serviceParam)) {
    initialValues.service = serviceParam
    initialValues.type = initialValues.type ?? 'project'
  }

  return (
    <PageTransition>
      <Seo
        title="Book a project or meeting"
        description="Book scoped delivery work or a thirty-minute intro call with the engineers who would build it."
      />

      <div className="pt-16">
        <BookingSection initialValues={initialValues} />
      </div>

      <FaqSection />
    </PageTransition>
  )
}
