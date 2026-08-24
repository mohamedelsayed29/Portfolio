import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { PROJECT_CATEGORIES } from '@data/projects'
import { cn } from '@lib/cn'
import { EASE_APPLE } from '@lib/animations'
import { useLocalized, useStrings } from '@/i18n'

const STRINGS = {
  en: {
    filterLabel: 'Filter projects by category',
    searchLabel: 'Search projects',
    searchPlaceholder: 'Search work or stack',
  },
  ar: {
    filterLabel: 'تصفية المشاريع حسب الفئة',
    searchLabel: 'البحث في المشاريع',
    searchPlaceholder: 'ابحث في الأعمال أو التقنيات',
  },
}

/**
 * Segmented control with a shared layout pill sliding between options — the
 * same affordance as iOS segmented controls.
 */
export function ProjectFilter({ category, onCategoryChange, query, onQueryChange }) {
  const categories = useLocalized(PROJECT_CATEGORIES)
  const s = useStrings(STRINGS)

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div
        role="tablist"
        aria-label={s.filterLabel}
        className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-surface-muted p-1"
      >
        {categories.map((item) => {
          const active = item.id === category

          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onCategoryChange(item.id)}
              className={cn(
                'relative rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap',
                'transition-colors duration-300',
                active ? 'text-text' : 'text-text-muted hover:text-text',
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-filter-pill"
                  transition={{ duration: 0.45, ease: EASE_APPLE }}
                  className="absolute inset-0 rounded-full bg-surface shadow-soft"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="relative w-full lg:max-w-[280px]">
        <Search
          size={16}
          aria-hidden="true"
          className="absolute top-1/2 start-4 -translate-y-1/2 text-text-subtle"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={s.searchPlaceholder}
          aria-label={s.searchLabel}
          className="h-11 w-full rounded-full border border-transparent bg-surface-muted pe-4 ps-11 text-[14px] transition-all duration-200 placeholder:text-text-subtle focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/16 focus:outline-none"
        />
      </div>
    </div>
  )
}
