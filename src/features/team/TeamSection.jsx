import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { SITE } from '@constants/site'
import { EASE_APPLE } from '@lib/animations'
import { usePrefersReducedMotion } from '@hooks'
import { useLanguage, useLocalized, useStrings } from '@/i18n'
import './team.css'

const TEAM = [
  {
    role: { en: 'Tech Lead Software Engineer', ar: 'قائد تقني ومهندس برمجيات' },
    name: { en: 'Mohamed Ali', ar: 'محمد علي' },
    bio: {
      en: 'Builds reliable products from interface details to backend logic.',
      ar: 'يبني منتجات موثوقة، من تفاصيل الواجهة حتى منطق الأنظمة الخلفية.',
    },
    tags: [
      { en: 'Backend', ar: 'أنظمة خلفية' },
      { en: 'Frontend', ar: 'واجهات أمامية' },
      { en: 'System Design', ar: 'تصميم الأنظمة' },
      { en: 'Mobile App', ar: 'تطبيقات الموبايل' },
      { en: 'Database', ar: 'قواعد البيانات' },
      { en: 'Product Manager', ar: 'إدارة المنتج' },
      { en: 'System Analysis', ar: 'تحليل الأنظمة' },
    ],
    image: '/team/mohamed-ali-halftone.png',
    portraitHeight: '88%',
    portraitScale: 1.02,
    linkedin: 'https://www.linkedin.com/in/mohamed-ali-031060367/',
  },
  {
    role: { en: 'AI / Software Engineer', ar: 'مهندس ذكاء اصطناعي وبرمجيات' },
    name: { en: 'Mohamed Nehad', ar: 'محمد نهاد' },
    bio: {
      en: 'Connects data, automation and AI features into production workflows.',
      ar: 'يدمج البيانات والأتمتة وقدرات الذكاء الاصطناعي في أنظمة تعمل فعليًا في الإنتاج.',
    },
    tags: [
      { en: 'Frontend', ar: 'واجهات أمامية' },
      { en: 'Backend', ar: 'أنظمة خلفية' },
      { en: 'Databases', ar: 'قواعد البيانات' },
      { en: 'Performance', ar: 'الأداء' },
      'RAG',
      'LLM',
    ],
    image: '/team/mohamed-nehad-halftone.png',
    portraitHeight: '88%',
    portraitScale: 1.02,
    linkedin: 'https://www.linkedin.com/in/mohammed-nehad-moghrabi-9ba988248/',
  },
  {
    role: { en: 'Software Engineer', ar: 'مهندس برمجيات' },
    name: { en: 'Mohamed Elsayed', ar: 'محمد السيد' },
    bio: {
      en: 'Turns complex requirements into clean, maintainable systems.',
      ar: 'يحوّل المتطلبات المعقّدة إلى أنظمة نظيفة يسهل صيانتها.',
    },
    tags: [
      { en: 'Backend', ar: 'أنظمة خلفية' },
      { en: 'Frontend', ar: 'واجهات أمامية' },
      { en: 'Database', ar: 'قواعد البيانات' },
      { en: 'Mobile Application', ar: 'تطبيقات الموبايل' },
      { en: 'System Design', ar: 'تصميم الأنظمة' },
    ],
    image: '/team/mohamed-elsayed-halftone.png',
    portraitHeight: '86%',
    portraitScale: 1,
    linkedin: 'https://www.linkedin.com/in/mohamed-elsayed-backend',
  },
]

const STRINGS = {
  en: {
    title: 'TEAM',
    focusLine1: 'Software',
    focusLine2: '& AI',
    baseLine1: 'Based',
    baseLine2: 'worldwide',
    email: 'Email us',
    activeMember: (n) => `Active team member ${n}`,
    openLinkedin: (name) => `Open ${name} on LinkedIn`,
  },
  ar: {
    title: 'الفريق',
    focusLine1: 'برمجيات',
    focusLine2: 'وذكاء اصطناعي',
    baseLine1: 'نعمل',
    baseLine2: 'حول العالم',
    email: 'راسلنا',
    activeMember: (n) => `عضو الفريق النشط ${n}`,
    openLinkedin: (name) => `افتح ملف ${name} على LinkedIn`,
  },
}

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
  const { isRTL } = useLanguage()
  const s = useStrings(STRINGS)
  const team = useLocalized(TEAM)
  const activeMember = team[activeIndex]

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
          {s.title}
        </motion.h2>

        <motion.p variants={childMotion}>
          {s.focusLine1}
          <br />
          {s.focusLine2}
        </motion.p>
        <motion.p variants={childMotion}>
          {s.baseLine1}
          <br />
          {s.baseLine2}
        </motion.p>
        <motion.a variants={childMotion} href={`mailto:${SITE.email}`} className="team-showcase__email">
          {s.email}
        </motion.a>
      </div>

      <div className="team-showcase__markers" aria-hidden="true">
        <span>+</span>
        <span>+</span>
        <span>+</span>
      </div>

      <motion.div variants={childMotion} className="team-showcase__count" aria-label={s.activeMember(activeIndex + 1)}>
        {String(activeIndex + 1).padStart(2, '0')}
      </motion.div>

      <div className="team-showcase__stage">
        <motion.div
          key={activeMember.image}
          className="team-showcase__portrait"
          initial={reduced ? false : { opacity: 0, x: isRTL ? 18 : -18, filter: 'blur(8px)' }}
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
          {team.map((member, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={member.linkedin}
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
                  aria-label={s.openLinkedin(member.name)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <ArrowUpRight size={18} className="rtl-flip" />
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
