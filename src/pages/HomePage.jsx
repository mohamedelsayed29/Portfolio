import { Seo } from '@components/common'
import { Hero } from '@features/hero'
import { ServicesSection } from '@features/services'
import { ProjectsSection } from '@features/projects'
import { ProcessSection } from '@features/process'
import { TestimonialsSection } from '@features/testimonials'
import { CtaSection, FaqSection } from '@features/contact'

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
