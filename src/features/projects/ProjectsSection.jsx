import { ArrowRight } from 'lucide-react'
import { Section } from '@components/layout'
import { SectionHeading, Reveal } from '@components/common'
import { Button } from '@components/ui'
import { FEATURED_PROJECTS } from '@data/projects'
import { ProjectCard } from './components/ProjectCard'

/** Home-page teaser: the three featured case studies, then a link to the index. */
export function ProjectsSection({ projects = FEATURED_PROJECTS }) {
  return (
    <Section id="work" width="wide" className="bg-surface-muted/40">
      <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Selected work"
          title="Things we shipped that stayed shipped"
          description="Six years of case studies, three of them below. Every number here came from the client's own dashboards."
          className="max-w-2xl"
        />
        <Reveal delay={0.15}>
          <Button variant="secondary" to="/work" icon={ArrowRight}>
            All projects
          </Button>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
