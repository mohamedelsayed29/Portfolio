import { ArrowRight } from 'lucide-react'
import { Section } from '@components/layout'
import { SectionHeading, Reveal } from '@components/common'
import { Button } from '@components/ui'
import { FEATURED_PROJECTS } from '@data/projects'
import { cn } from '@lib/cn'
import { useStrings } from '@/i18n'
import { ProjectCard } from './components/ProjectCard'

const STRINGS = {
  en: {
    eyebrow: 'Selected work',
    title: 'Things we shipped that stayed shipped',
    description: 'Recent case studies across web, mobile and backend systems.',
    allProjects: 'All projects',
  },
  ar: {
    eyebrow: 'أعمال مختارة',
    title: 'أعمال أطلقناها وبقيت تعمل',
    description: 'دراسات حالة حديثة عبر الويب والموبايل والأنظمة الخلفية.',
    allProjects: 'كل المشاريع',
  },
}

/** Forward arrow that flips with the reading direction. */
const ArrowRightIcon = (props) => <ArrowRight {...props} className="rtl:-scale-x-100" />

/** Home-page teaser: featured case studies, then a link to the full index. */
export function ProjectsSection({ projects = FEATURED_PROJECTS }) {
  const s = useStrings(STRINGS)

  return (
    <Section id="work" width="wide" className="bg-surface-muted/40">
      <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow={s.eyebrow}
          title={s.title}
          description={s.description}
          className="max-w-2xl"
        />
        <Reveal delay={0.15}>
          <Button variant="secondary" to="/work" icon={ArrowRightIcon}>
            {s.allProjects}
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
