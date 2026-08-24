import { Section } from '@components/layout'
import { Seo, SectionHeading, PageTransition } from '@components/common'
import { ProjectFilter, ProjectGrid, useProjectFilter } from '@features/projects'
import { CtaSection } from '@features/contact'
import { pluralize } from '@lib/format'
import { useLanguage, useStrings } from '@/i18n'

const STRINGS = {
  en: {
    seoTitle: 'Work',
    seoDescription:
      'Case studies across AI, web, mobile and backend engagements — with the numbers behind them.',
    eyebrow: 'Selected work',
    title: 'Case studies, not screenshots',
    description:
      "Every project here shipped to production. The metrics come from the client's own dashboards, not ours.",
    emptyMessage: 'Nothing matches that search — try a different stack or category.',
  },
  ar: {
    seoTitle: 'الأعمال',
    seoDescription:
      'دراسات حالة في الذكاء الاصطناعي والويب والموبايل والأنظمة الخلفية — ومعها الأرقام التي تثبتها.',
    eyebrow: 'أعمال مختارة',
    title: 'دراسات حالة، لا مجرد لقطات شاشة',
    description:
      'كل مشروع هنا وصل إلى الإنتاج فعلًا، والأرقام مأخوذة من لوحات تحكم عملائنا أنفسهم، لا من عندنا.',
    emptyMessage: 'لا نتائج تطابق هذا البحث — جرّب تقنية أو فئة أخرى.',
  },
}

/** Arabic plurals have their own forms per count band; English keeps pluralize(). */
const projectCount = {
  en: (count) => pluralize(count, 'project'),
  ar: (count) => {
    if (count === 0) return 'لا توجد مشاريع'
    if (count === 1) return 'مشروع واحد'
    if (count === 2) return 'مشروعان'
    if (count <= 10) return `${count} مشاريع`
    return `${count} مشروعًا`
  },
}

export default function ProjectsPage() {
  const { category, setCategory, query, setQuery, filtered } = useProjectFilter()
  const { language } = useLanguage()
  const s = useStrings(STRINGS)

  return (
    <PageTransition>
      <Seo title={s.seoTitle} description={s.seoDescription} />

      <Section width="wide" spacing="sm" className="pt-20">
        <SectionHeading
          eyebrow={s.eyebrow}
          title={s.title}
          description={s.description}
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
            {projectCount[language](filtered.length)}
          </p>

          <ProjectGrid projects={filtered} emptyMessage={s.emptyMessage} />
        </div>
      </Section>

      <CtaSection />
    </PageTransition>
  )
}
