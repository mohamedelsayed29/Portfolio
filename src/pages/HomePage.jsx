import { Seo } from '@components/common'
import { Hero } from '@features/hero'
import { ServicesSection } from '@features/services'
import { AudienceSection } from '@features/audience'
import { ProjectsSection } from '@features/projects'
// import { TeamSection } from '@features/team'
import { ProcessSection } from '@features/process'
import { TestimonialsSection } from '@features/testimonials'
import { CtaSection, FaqSection } from '@features/contact'

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <ServicesSection />
      <AudienceSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FaqSection />
      {/* <TeamSection /> */}
      <CtaSection />
    </>
  )
}
