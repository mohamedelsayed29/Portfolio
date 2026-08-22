import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { SITE } from '@constants/site'
import { EASE_APPLE } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'
import './team.css'

const TEAM = [
  {
    role: 'Tech Lead Software Engineer',
    name: 'Mohamed Ali',
    bio: 'Builds reliable products from interface details to backend logic.',
    tags: [
      'Backend',
      'Frontend',
      'System Design',
      'Mobile App',
      'Database',
      'Product Manager',
      'System Analysis',
    ],
    image: '/team/mohamed-ali-halftone.png',
    portraitHeight: '88%',
    portraitScale: 1.02,
    linkedin: 'https://www.linkedin.com/in/mohamed-ali-031060367/',
  },
  {
    role: 'AI / Software Engineer',
    name: 'Mohamed Nehad',
    bio: 'Turns complex requirements into clean, maintainable systems.',
    tags: ['Frontend', 'Backend', 'Databases', 'Performance', 'RAG', 'LLM'],
    image: '/team/mohamed-nehad-halftone.png',
    portraitHeight: '88%',
    portraitScale: 1.02,
    linkedin: 'https://www.linkedin.com/in/mohammed-nehad-moghrabi-9ba988248/',
  },
  {
    role: 'Software Engineer',
    name: 'Mohamed Elsayed',
    bio: 'Connects data, automation and AI features into production workflows.',
    tags: ['Backend', 'Frontend', 'Database', 'Mobile Application', 'System Design'],
    image: '/team/mohamed-elsayed-halftone.png',
    portraitHeight: '86%',
    portraitScale: 1,
    linkedin: 'https://www.linkedin.com/in/mohamed-elsayed-backend',
  },
]

const sectionMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_APPLE, staggerChildren: 0.08 },
  },
}

const childMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_APPLE } },
}

export function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const reduced = usePrefersReducedMotion()
  const activeMember = TEAM[activeIndex]

  useEffect(() => {
    if (reduced || isInteracting) return undefined

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % TEAM.length)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [isInteracting, reduced])

  return (
    <motion.section
      id="team"
      className="team-showcase scroll-mt-24"
      variants={sectionMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
    >
      <div className="team-showcase__meta">
        <motion.h2 variants={childMotion} className="team-showcase__title">
          TEAM
        </motion.h2>

        <motion.p variants={childMotion}>
          Software
          <br />
          & AI
        </motion.p>
        <motion.p variants={childMotion}>
          Based
          <br />
          worldwide
        </motion.p>
        <motion.a variants={childMotion} href={`mailto:${SITE.email}`} className="team-showcase__email">
          Email us
        </motion.a>
      </div>

      <div className="team-showcase__markers" aria-hidden="true">
        <span>+</span>
        <span>+</span>
        <span>+</span>
      </div>

      <motion.div variants={childMotion} className="team-showcase__count" aria-label={`Active team member ${activeIndex + 1}`}>
        {String(activeIndex + 1).padStart(2, '0')}
      </motion.div>

      <div className="team-showcase__stage">
        <motion.div
          key={activeMember.name}
          className="team-showcase__portrait"
          initial={reduced ? false : { opacity: 0, x: -18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: EASE_APPLE }}
          style={{
            '--portrait-x': `${activeIndex * -1.2}%`,
            '--portrait-height': activeMember.portraitHeight ?? '100%',
            '--portrait-scale': activeMember.portraitScale ?? 1 + activeIndex * 0.018,
          }}
        >
          <img src={activeMember.image ?? '/team/halftone-portrait.png'} alt="" />
        </motion.div>

        <motion.div variants={childMotion} className="team-showcase__panel">
          {TEAM.map((member, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={member.name}
                role="button"
                tabIndex={0}
                className="team-showcase__row"
                data-active={isActive || undefined}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveIndex(index)
                  }
                }}
                onFocus={() => {
                  setIsInteracting(true)
                  setActiveIndex(index)
                }}
                onBlur={() => setIsInteracting(false)}
                onPointerEnter={() => {
                  setIsInteracting(true)
                  setActiveIndex(index)
                }}
                onPointerLeave={() => setIsInteracting(false)}
              >
                <span className="team-showcase__row-number">({String(index + 1).padStart(3, '0')})</span>
                <span className="team-showcase__row-role">{member.role}</span>
                <a
                  className="team-showcase__row-icon"
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Open ${member.name} on LinkedIn`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <ArrowUpRight size={18} />
                </a>

                <span className="team-showcase__member">
                  <span className="team-showcase__member-copy">
                    <strong>{member.name}</strong>
                    <span>{member.bio}</span>
                  </span>
                  <span className="team-showcase__tags">
                    {member.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
