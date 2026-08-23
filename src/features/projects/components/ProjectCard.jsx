import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@components/ui'
import { Reveal } from '@components/common'
import { cn } from '@lib/cn'
import { PATHS } from '@app/router/paths'

export function ProjectCard({ project, index = 0, featured = false }) {
  return (
    <Reveal delay={(index % 3) * 0.07} className="h-full">
      <Link
        to={PATHS.workDetail(project.slug)}
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-apple-lg)]',
          'border border-line bg-surface transition-all duration-500 ease-[var(--ease-apple)]',
          'hover:-translate-y-1.5 hover:border-line-strong hover:shadow-float',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden',
            featured ? 'aspect-[16/10]' : 'aspect-[4/3]',
          )}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} - ${project.subtitle}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full scale-105 object-cover object-left-top transition-transform duration-[900ms] ease-[var(--ease-apple)] group-hover:scale-115"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-105 transition-transform duration-[900ms] ease-[var(--ease-apple)] group-hover:scale-115"
              style={{ background: project.cover }}
            />
          )}
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 bg-gradient-to-t to-transparent',
              project.image ? 'from-black/80 via-black/25' : 'from-black/55 via-black/5',
            )}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
            <div>
              <p className="text-[13px] font-medium text-white/70">
                {project.cardLabel ?? project.client}
              </p>
              <h3 className="text-[26px] leading-tight font-semibold text-white">
                {project.title}
              </h3>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 ease-[var(--ease-apple)] group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={17} aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-center gap-2">
            <Badge tone="outline">{project.subtitle}</Badge>
            <span className="text-[12px] text-text-subtle tabular-nums">{project.year}</span>
          </div>

          <p className="text-[15px] leading-relaxed text-text-muted">{project.summary}</p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.stack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-text-subtle"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </Reveal>
  )
}
