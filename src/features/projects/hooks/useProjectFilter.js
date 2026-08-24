import { useMemo, useState } from 'react'
import { PROJECTS } from '@data/projects'
import { isLocaleObject } from '@/i18n'

/** Flattens `{ en, ar }` fields so free-text search matches either language. */
const searchText = (field) => (isLocaleObject(field) ? Object.values(field).join(' ') : field)

/**
 * Category + free-text filtering for the work index. Kept as a hook so the
 * grid stays presentational and the page owns nothing but layout.
 */
export function useProjectFilter(projects = PROJECTS) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesCategory = category === 'all' || project.category === category
      if (!matchesCategory) return false
      if (!needle) return true

      const haystack = [project.title, project.subtitle, project.summary, ...project.stack]
        .map(searchText)
        .join(' ')
        .toLowerCase()

      return haystack.includes(needle)
    })
  }, [projects, category, query])

  return { category, setCategory, query, setQuery, filtered }
}
