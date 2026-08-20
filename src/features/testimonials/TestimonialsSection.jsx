import { Section } from '@components/layout'
import { SectionHeading } from '@components/common'
import { TESTIMONIALS } from '@data/testimonials'
import { TestimonialCard } from './components/TestimonialCard'

export function TestimonialsSection({ testimonials = TESTIMONIALS }) {
  return (
    <Section id="testimonials" width="wide" className="bg-surface-muted/40">
      <SectionHeading
        eyebrow="What clients say"
        title="Judge us on the handover"
        description="Anyone can ship a demo. These are the people who kept the code after we left."
        align="center"
        className="mb-14"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </Section>
  )
}
