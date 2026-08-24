import { TechLogo } from '@components/common'
import { useStrings } from '@/i18n'
import { TECH_STACK } from '@data/tech'

const STRINGS = {
  en: { listLabel: 'Technologies we work with' },
  ar: { listLabel: 'تقنيات نعمل بها' },
}

/**
 * Infinite technology ticker. The list is rendered twice and translated by
 * exactly -50%, which is what makes the loop seamless — the duplicate is hidden
 * from assistive tech so the stack is announced once.
 */
export function HeroMarquee({ items = TECH_STACK }) {
  const s = useStrings(STRINGS)

  return (
    <div className="mask-fade-x relative w-full overflow-hidden py-2">
      <div className="flex w-max animate-marquee items-center gap-3 hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            aria-label={copy === 0 ? s.listLabel : undefined}
            className="flex shrink-0 items-center gap-3"
          >
            {items.map((tech) => (
              <li key={tech.slug}>
                <span
                  className={[
                    'group flex items-center gap-2.5 rounded-full border border-line',
                    'bg-surface/70 py-2 pe-4 ps-3 backdrop-blur-sm',
                    'transition-all duration-400 ease-[var(--ease-apple)]',
                    'hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface hover:shadow-soft',
                  ].join(' ')}
                >
                  <TechLogo
                    tech={tech}
                    size={18}
                    className="transition-transform duration-400 ease-[var(--ease-apple)] group-hover:scale-110"
                  />
                  <span className="text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap text-text-muted transition-colors duration-300 group-hover:text-text">
                    {tech.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
