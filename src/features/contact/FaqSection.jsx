import { Section } from '@components/layout'
import { SectionHeading, Reveal } from '@components/common'
import { useLocalized, useStrings } from '@/i18n'
import { FAQS } from '@data/faqs'
import { FaqItem } from './components/FaqItem'

const STRINGS = {
  en: {
    eyebrow: 'Questions',
    title: 'The ones we always get asked',
  },
  ar: {
    eyebrow: 'الأسئلة الشائعة',
    title: 'ما نُسأل عنه دائمًا',
  },
}

export function FaqSection({ faqs = FAQS }) {
  const s = useStrings(STRINGS)
  const localizedFaqs = useLocalized(faqs)

  return (
    <Section id="faq" width="narrow" spacing="md">
      <SectionHeading
        eyebrow={s.eyebrow}
        title={s.title}
        align="center"
        className="mb-12"
      />

      <Reveal>
        <div className="border-t border-line">
          {localizedFaqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
