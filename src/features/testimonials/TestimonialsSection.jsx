import { Section } from '@components/layout'
import { SectionHeading } from '@components/common'
import { useLocalized, useStrings } from '@/i18n'
import { TESTIMONIALS } from '@data/testimonials'
import { TestimonialCard } from './components/TestimonialCard'

const STRINGS = {
  en: {
    eyebrow: 'What clients say',
    title: 'Judge us on the handover',
    description: 'Anyone can ship a demo. These are the people who kept the code after we left.',
  },
  ar: {
    eyebrow: 'آراء عملائنا',
    title: 'احكموا علينا بعد التسليم',
    description: 'أي فريق يستطيع تقديم نسخة تجريبية. هؤلاء من واصلوا العمل بالكود بعد رحيلنا.',
  },
}

export function TestimonialsSection({ testimonials = TESTIMONIALS }) {
  const s = useStrings(STRINGS)
  const localizedTestimonials = useLocalized(testimonials)

  return (
    <Section id="testimonials" width="wide" className="bg-surface-muted/40">
      <SectionHeading
        eyebrow={s.eyebrow}
        title={s.title}
        description={s.description}
        align="center"
        className="mb-14"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {localizedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </Section>
  )
}
