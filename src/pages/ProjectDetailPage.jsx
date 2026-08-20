import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@components/layout'
import { Seo, Reveal, PageTransition } from '@components/common'
import { Badge, Button } from '@components/ui'
import { getProjectBySlug, getRelatedProjects } from '@data/projects'
import { ProjectCard } from '@features/projects'
import { CtaSection } from '@features/contact'
import { useBooking } from '@app/providers'
import { EASE_APPLE } from '@lib/animations'

const NARRATIVE = [
  { key: 'problem', label: 'The problem' },
  { key: 'approach', label: 'What we did' },
  { key: 'outcome', label: 'The outcome' },
]

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const { openBooking } = useBooking()

  if (!project) return <Navigate to="/work" replace />

  const related = getRelatedProjects(slug)

  return (
    <PageTransition>
      <Seo title={`${project.title} — ${project.subtitle}`} description={project.summary} />

      <Section width="wide" spacing="sm" className="pt-14">
        <Link
          to="/work"
          className="mb-10 inline-flex items-center gap-2 text-[14px] text-text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All work
        </Link>

        <div className="flex max-w-3xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">{project.subtitle}</Badge>
            <span className="text-[13px] text-text-subtle tabular-nums">
              {project.client} · {project.year}
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-semibold">
            {project.title}
          </h1>

          <p className="max-w-[56ch] text-[19px] leading-relaxed text-text-muted sm:text-[21px]">
            {project.summary}
          </p>
        </div>
      </Section>

      <Container width="wide">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_APPLE }}
          className="aspect-[21/9] w-full overflow-hidden rounded-[var(--radius-apple-lg)]"
          style={project.image ? undefined : { background: project.cover }}
        >
          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} — ${project.subtitle}`}
              className="size-full object-cover object-top"
            />
          )}
        </motion.div>
      </Container>

      <Section width="wide" spacing="md">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            {NARRATIVE.map((part, index) => (
              <Reveal key={part.key} delay={index * 0.06} className="flex flex-col gap-3">
                <h2 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                  {part.label}
                </h2>
                <p className="max-w-[62ch] text-[18px] leading-relaxed">{project[part.key]}</p>
              </Reveal>
            ))}
          </div>

          <aside className="flex flex-col gap-10">
            <Reveal className="flex flex-col gap-5">
              <h2 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                Results
              </h2>
              <dl className="flex flex-col gap-5">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border-l-2 border-accent pl-4">
                    <dd className="text-[30px] font-semibold tracking-[-0.02em]">{metric.value}</dd>
                    <dt className="text-[13px] text-text-subtle">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.08} className="flex flex-col gap-4">
              <h2 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                Stack
              </h2>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-surface-muted px-3 py-1.5 text-[13px] text-text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14} className="flex flex-col gap-3">
              <Button
                onClick={() =>
                  openBooking({ type: 'project', service: project.services[0], projectSlug: slug })
                }
              >
                Start something like this
              </Button>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[14px] text-text-muted transition-colors hover:text-text"
                >
                  Visit the live product
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </Reveal>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section width="wide" spacing="sm" className="bg-surface-muted/40">
          <h2 className="mb-10 text-[28px] font-semibold tracking-[-0.02em]">Next case study</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((item, index) => (
              <ProjectCard key={item.slug} project={item} index={index} featured />
            ))}
          </div>
        </Section>
      )}

      <CtaSection />
    </PageTransition>
  )
}
