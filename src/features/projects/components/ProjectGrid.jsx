import { AnimatePresence, motion } from 'motion/react'
import { EASE_APPLE } from '@lib/animations'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid({ projects, emptyMessage = 'No projects match that filter yet.' }) {
  if (projects.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-apple-lg)] border border-dashed border-line py-24 text-center">
        <p className="text-[15px] text-text-muted">{emptyMessage}</p>
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
