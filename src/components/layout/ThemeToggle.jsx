import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@app/providers'
import { EASE_APPLE } from '@lib/animations'
import { cn } from '@lib/cn'

export function ThemeToggle({ className, onDark = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} appearance`}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full',
        'transition-colors duration-300',
        onDark
          ? 'text-white/70 hover:bg-white/10 hover:text-white'
          : 'text-text-muted hover:bg-surface-muted hover:text-text',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.32, ease: EASE_APPLE }}
          className="grid place-items-center"
        >
          {isDark ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
