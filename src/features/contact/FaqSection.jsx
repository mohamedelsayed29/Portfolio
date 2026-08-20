import { Section } from '@components/layout'
import { SectionHeading, Reveal } from '@components/common'
import { FAQS } from '@data/faqs'
import { FaqItem } from './components/FaqItem'

export function FaqSection({ faqs = FAQS }) {
  return (
    <Section id="faq" width="narrow" spacing="md">
      <SectionHeading
        eyebrow="Questions"
        title="The ones we always get asked"
        align="center"
        className="mb-12"
      />

      <Reveal>
        <div className="border-t border-line">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
