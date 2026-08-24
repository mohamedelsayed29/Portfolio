import { AnimatePresence, motion } from 'motion/react'
import { EASE_APPLE } from '@lib/animations'
import { useStrings } from '@/i18n'
import { ProjectCard } from './ProjectCard'

const STRINGS = {
  en: { empty: 'No projects match that filter yet.' },
  ar: { empty: 'لا توجد مشاريع تطابق هذه التصفية بعد.' },
}

export function ProjectGrid({ projects, emptyMessage }) {
  const s = useStrings(STRINGS)

  if (projects.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-apple-lg)] border border-dashed border-line py-24 text-center">
        <p className="text-[15px] text-text-muted">{emptyMessage ?? s.empty}</p>
      </div>
    )
  }

  return (
    <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project.slug}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.42, ease: EASE_APPLE }}
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
