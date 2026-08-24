import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { NAV_LINKS } from '@constants/navigation'
import { SITE } from '@constants/site'
import { useLocalized, useStrings } from '@/i18n'
import { EASE_APPLE } from '@lib/animations'
import { Button } from '@components/ui'
import { useLockBodyScroll } from '@hooks'

const STRINGS = {
  en: { bookCta: 'Book a project or meeting' },
  ar: { bookCta: 'احجز مشروعًا أو مكالمة' },
}

const panel = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE_APPLE, staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: EASE_APPLE } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_APPLE } },
  exit: { opacity: 0, y: 10 },
}

export function MobileMenu({ open, onClose }) {
  useLockBodyScroll(open)
  const navLinks = useLocalized(NAV_LINKS)
  const s = useStrings(STRINGS)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="glass-panel fixed inset-0 top-[var(--nav-h)] z-40 flex flex-col justify-between overflow-y-auto border-t px-6 pt-10 pb-12 lg:hidden"
        >
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <motion.div key={link.to} variants={item}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="group flex items-center justify-between border-b border-line py-5 text-[28px] font-semibold tracking-[-0.02em]"
                >
                  {link.label}
                  <ArrowUpRight
                    size={22}
                    aria-hidden="true"
                    className="text-text-subtle transition-transform duration-300 ease-[var(--ease-apple)] group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div variants={item} className="mt-10 flex flex-col gap-5">
            <Button to="/book" size="lg" onClick={onClose} className="w-full">
              {s.bookCta}
            </Button>
            <a
              href={`mailto:${SITE.email}`}
              className="text-center text-[15px] text-text-muted transition-colors hover:text-text"
            >
              {SITE.email}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
