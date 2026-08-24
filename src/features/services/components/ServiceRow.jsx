import { Link } from 'react-router-dom'
import { cn } from '@lib/cn'
import { useLocalized, useStrings } from '@/i18n'
import { SERVICE_ICONS } from '../icons'

const STRINGS = {
  en: { book: 'Book this', details: 'Details' },
  ar: { book: 'احجز الآن', details: 'التفاصيل' },
}

/**
 * A row, not a card. Six identical bordered cards with icon tiles, checkmark
 * bullets and "From $X" badges is the stock template layout; a plain two-column
 * list puts the reading order where it belongs and lets the type do the work.
 */
export function ServiceRow({ service: rawService, onBook }) {
  const service = useLocalized(rawService)
  const s = useStrings(STRINGS)
  const Icon = SERVICE_ICONS[service.icon]

  return (
    <div
      id={service.id}
      className="group grid scroll-mt-28 gap-x-10 gap-y-4 border-t border-line py-10 md:grid-cols-[minmax(0,18rem)_1fr]"
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="mt-1.5 shrink-0 text-text-subtle transition-colors duration-300 group-hover:text-text"
          />
        )}
        <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.015em]">
          {service.title}
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        <p className="max-w-[58ch] text-[17px] leading-relaxed text-text-muted">
          {service.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="text-[13px] text-text-subtle">{service.stack.slice(0, 5).join(' · ')}</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onBook?.(service)}
              className={cn(
                'text-[13px] font-medium text-accent underline-offset-4',
                'transition-colors duration-200 hover:underline',
              )}
            >
              {s.book}
            </button>
            <Link
              to={`/services#${service.id}`}
              className="text-[13px] text-text-subtle underline-offset-4 transition-colors duration-200 hover:text-text hover:underline"
            >
              {s.details}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
