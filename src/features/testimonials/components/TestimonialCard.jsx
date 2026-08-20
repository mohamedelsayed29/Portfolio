import { Quote, Star } from 'lucide-react'
import { Card } from '@components/ui'
import { Reveal } from '@components/common'

export function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Card className="flex h-full flex-col gap-6 p-8">
        <Quote size={24} className="text-accent/40" aria-hidden="true" />

        <blockquote className="flex-1 text-[17px] leading-relaxed tracking-[-0.01em]">
          {testimonial.quote}
        </blockquote>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
          <div className="flex flex-col">
            <cite className="text-[15px] font-medium not-italic">{testimonial.author}</cite>
            <span className="text-[13px] text-text-subtle">{testimonial.role}</span>
          </div>
          <div
            className="flex gap-0.5"
            role="img"
            aria-label={`${testimonial.rating} out of 5`}
          >
            {Array.from({ length: testimonial.rating }, (_, index) => (
              <Star key={index} size={13} className="fill-warning text-warning" aria-hidden="true" />
            ))}
          </div>
        </div>
      </Card>
    </Reveal>
  )
}
