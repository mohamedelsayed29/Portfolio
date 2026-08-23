import { ArrowRight } from 'lucide-react'
import { Section } from '@components/layout'
import { SectionHeading, Reveal } from '@components/common'
import { Button } from '@components/ui'
import { FEATURED_PROJECTS } from '@data/projects'
import { cn } from '@lib/cn'
import { ProjectCard } from './components/ProjectCard'

/** Home-page teaser: featured case studies, then a link to the full index. */
export function ProjectsSection({ projects = FEATURED_PROJECTS }) {
  return (
    <Section id="work" width="wide" className="bg-surface-muted/40">
      <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Selected work"
          title="Things we shipped that stayed shipped"
          description="Four recent case studies across web, mobile and backend systems."
          className="max-w-2xl"
        />
        <Reveal delay={0.15}>
          <Button variant="secondary" to="/work" icon={ArrowRight}>
            All projects
          </Button>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
        {projects.map((project, index) => {
          const centerLastRow = projects.length === 5 && index >= 3
          const useTwoColumnLayout = projects.length === 4

          return (
            <div
              key={project.slug}
              className={cn(
                'h-full',
                useTwoColumnLayout ? 'xl:col-span-3' : 'xl:col-span-2',
                centerLastRow && index === 3 && 'xl:col-start-2',
                centerLastRow && index === 4 && 'xl:col-start-4',
              )}
            >
              <ProjectCard project={project} index={index} />
            </div>
          )
        })}
      </div>
    </Section>
  )
}
