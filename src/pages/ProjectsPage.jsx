import { Section } from '@components/layout'
import { Seo, SectionHeading, PageTransition } from '@components/common'
import { ProjectFilter, ProjectGrid, useProjectFilter } from '@features/projects'
import { CtaSection } from '@features/contact'
import { pluralize } from '@lib/format'

export default function ProjectsPage() {
  const { category, setCategory, query, setQuery, filtered } = useProjectFilter()

  return (
    <PageTransition>
      <Seo
        title="Work"
        description="Case studies across AI, web, mobile and backend engagements — with the numbers behind them."
      />

      <Section width="wide" spacing="sm" className="pt-20">
        <SectionHeading
          eyebrow="Selected work"
          title="Case studies, not screenshots"
          description="Every project here shipped to production. The metrics come from the client's own dashboards, not ours."
          className="mb-12 max-w-3xl"
        />

        <div className="flex flex-col gap-8">
          <ProjectFilter
            category={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
          />

          <p aria-live="polite" className="text-[13px] text-text-subtle">
            {pluralize(filtered.length, 'project')}
          </p>

          <ProjectGrid
            projects={filtered}
            emptyMessage="Nothing matches that search — try a different stack or category."
          />
        </div>
      </Section>

      <CtaSection />
    </PageTransition>
  )
}
