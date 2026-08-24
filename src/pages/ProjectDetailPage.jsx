import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight, FileText, PlayCircle } from 'lucide-react'
import { Container, Section } from '@components/layout'
import { Seo, Reveal, PageTransition } from '@components/common'
import { Badge, Button, Card } from '@components/ui'
import { getProjectBySlug, getRelatedProjects } from '@data/projects'
import { ProjectCard } from '@features/projects'
import { CtaSection } from '@features/contact'
import { useBooking } from '@app/providers'
import { EASE_APPLE } from '@lib/animations'
import { useLocalized, useStrings } from '@/i18n'

const NARRATIVE = [
  { key: 'problem', label: { en: 'The problem', ar: 'المشكلة' } },
  { key: 'approach', label: { en: 'What we did', ar: 'ما قمنا به' } },
  { key: 'outcome', label: { en: 'The outcome', ar: 'النتيجة' } },
]

const STRINGS = {
  en: {
    allWork: 'All work',
    results: 'Results',
    stack: 'Stack',
    startProject: 'Start something like this',
    visitSite: 'Visit the live product',
    nextCaseStudy: 'Next case study',
    openPdf: 'Open PDF',
    download: 'Download',
    pdfDescription: (title) =>
      `Open the ${title} feature PDF for a deeper look at the platform modules, resident flows and management tools.`,
  },
  ar: {
    allWork: 'كل الأعمال',
    results: 'النتائج',
    stack: 'التقنيات',
    startProject: 'ابدأ مشروعًا كهذا',
    visitSite: 'شاهد المنتج مباشرةً',
    nextCaseStudy: 'دراسة الحالة التالية',
    openPdf: 'فتح ملف PDF',
    download: 'تحميل',
    pdfDescription: (title) =>
      `افتح ملف مزايا ${title} لنظرة أعمق على وحدات المنصة ومسارات المستخدمين وأدوات الإدارة.`,
  },
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = useLocalized(getProjectBySlug(slug))
  const narrative = useLocalized(NARRATIVE)
  const s = useStrings(STRINGS)
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
          <ArrowLeft size={15} aria-hidden="true" className="rtl:-scale-x-100" />
          {s.allWork}
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
              alt={`${project.title} - ${project.subtitle}`}
              className="size-full object-cover object-top"
            />
          )}
        </motion.div>
      </Container>

      {project.resources && (
        <Section width="wide" spacing="sm">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            {project.resources.video && (
              <Reveal className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                  <PlayCircle size={16} aria-hidden="true" />
                  {project.resources.video.label}
                </div>
                <div className="aspect-video overflow-hidden rounded-[var(--radius-apple-lg)] border border-line bg-surface-muted shadow-card">
                  <iframe
                    src={project.resources.video.embed}
                    title={`${project.title} — ${project.resources.video.label}`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            )}

            {project.resources.pdf && (
              <Reveal delay={0.08}>
                <Card className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
                  <div className="flex flex-col gap-4">
                    <span className="grid size-12 place-items-center rounded-[14px] bg-accent/10 text-accent">
                      <FileText size={22} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
                        {project.resources.pdf.label}
                      </h2>
                      <p className="text-[14px] leading-relaxed text-text-muted">
                        {s.pdfDescription(project.title)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button href={project.resources.pdf.href}>
                      {s.openPdf}
                    </Button>
                    <a
                      href={project.resources.pdf.href}
                      download
                      className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-6 text-[15px] font-medium tracking-[-0.01em] text-text transition-all duration-300 ease-[var(--ease-apple)] hover:border-line-strong hover:bg-surface-muted"
                    >
                      {s.download}
                    </a>
                  </div>
                </Card>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      <Section width="wide" spacing="md">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            {narrative.map((part, index) => (
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
                {s.results}
              </h2>
              <dl className="flex flex-col gap-5">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border-s-2 border-accent ps-4">
                    <dd className="text-[30px] font-semibold tracking-[-0.02em]">{metric.value}</dd>
                    <dt className="text-[13px] text-text-subtle">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.08} className="flex flex-col gap-4">
              <h2 className="text-[13px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
                {project.stackLabel ?? s.stack}
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
                {s.startProject}
              </Button>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-[14px] text-text-muted transition-colors hover:text-text"
                >
                  {s.visitSite}
                  <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
                </a>
              )}
            </Reveal>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section width="wide" spacing="sm" className="bg-surface-muted/40">
          <h2 className="mb-10 text-[28px] font-semibold tracking-[-0.02em]">{s.nextCaseStudy}</h2>
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
