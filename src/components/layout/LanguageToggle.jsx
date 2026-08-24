import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '@/i18n'
import { EASE_APPLE } from '@lib/animations'
import { cn } from '@lib/cn'

/** Shows the language you would switch TO, mirroring the ThemeToggle's shape. */
export function LanguageToggle({ className, onDark = false }) {
  const { language, toggleLanguage } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full',
        'text-[13px] font-semibold transition-colors duration-300',
        onDark
          ? 'text-white/70 hover:bg-white/10 hover:text-white'
          : 'text-text-muted hover:bg-surface-muted hover:text-text',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASE_APPLE }}
          className="grid place-items-center leading-none"
          lang={isArabic ? 'en' : 'ar'}
        >
          {isArabic ? 'EN' : 'ع'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
