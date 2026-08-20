import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { cn } from '@lib/cn'
import { EASE_APPLE } from '@lib/animations'
import { SERVICE_ICONS } from '../icons'

/**
 * One card in the fanned deck. The deal (x / y / rotate) lives on the outer
 * motion element; the hover lift lives on the inner one as a plain CSS
 * transition. Keeping them on separate elements means the two never fight over
 * the same `transform`, and hover stays responsive while the deal is in flight.
 *
 * Offsets are expressed in percentages of the card's own width, so the spread
 * scales with the responsive card size without a breakpoint-aware step value.
 */
const dealCard = (offset, tilt, lift) => ({
  // Every card starts squared up on the pile and slides out to its place.
  hidden: { opacity: 0, x: '0%', y: '0%', rotate: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    x: `${offset}%`,
    y: `${lift}%`,
    rotate: tilt,
    scale: 1,
    transition: { duration: 0.85, ease: EASE_APPLE },
  },
})

export function ServiceCard({
  service,
  index,
  offset,
  tilt,
  lift,
  isActive,
  isMuted,
  onActivate,
  onBook,
}) {
  const Icon = SERVICE_ICONS[service.icon]

  return (
    <motion.div
      variants={dealCard(offset, tilt, lift)}
      style={{ zIndex: isActive ? 50 : index + 1 }}
      className="[grid-area:1/1] size-[13rem] lg:size-[18rem] xl:size-[23rem]"
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      {/* `--untilt` cancels the deal's rotation, so a hovered card stands
          upright and square to the reader instead of lifting still crooked. */}
      <article
        style={{ '--untilt': `${-tilt}deg` }}
        className={cn(
          'group relative flex h-full w-full flex-col justify-between overflow-hidden',
          'rounded-[26px] border border-line bg-surface p-5 shadow-card lg:rounded-[32px] lg:p-7',
          'transition-[transform,box-shadow,opacity,border-color] duration-500 ease-[var(--ease-apple)]',
          'hover:[transform:translateY(-1.5rem)_scale(1.04)_rotate(var(--untilt))]',
          'focus-within:[transform:translateY(-1.5rem)_scale(1.04)_rotate(var(--untilt))]',
          'hover:border-line-strong hover:shadow-float focus-within:shadow-float',
          isMuted && 'opacity-55',
        )}
      >
        {/* Accent wash — barely there, but it stops six identical grey cards. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, ${service.accent} 16%, transparent) 0%, transparent 62%)`,
          }}
        />

        {/* The card is mostly empty at this size; the oversized mark fills the
            middle the way the reference's 3D renders do. */}
        {Icon && (
          <Icon
            aria-hidden="true"
            strokeWidth={1}
            className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.16] lg:size-32 xl:size-40"
            style={{ color: service.accent }}
          />
        )}

        {/* Card-sized hit target for the details route. The Book button sits above it. */}
        <Link
          to={`/services#${service.id}`}
          className="absolute inset-0 rounded-[26px] lg:rounded-[32px]"
          aria-label={`${service.title} — details`}
        />

        <div className="relative flex items-start justify-between">
          <span
            className="grid size-10 place-items-center rounded-[12px] lg:size-12 lg:rounded-[14px]"
            style={{ background: `color-mix(in srgb, ${service.accent} 14%, transparent)` }}
          >
            {Icon && <Icon className="size-5 lg:size-6" aria-hidden="true" style={{ color: service.accent }} />}
          </span>
          <span className="font-mono text-[11px] text-text-subtle lg:text-[12px]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="relative flex flex-col gap-2 lg:gap-3">
          <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.02em] lg:text-[22px] xl:text-[26px]">
            {service.title}
          </h3>

          <p className="text-[11px] leading-relaxed text-text-subtle lg:text-[13px]">
            {service.stack.slice(0, 3).join(' · ')}
          </p>

          {/* Held back until the card is the one in focus — the fan hides most of
              this area anyway, and revealing it is what makes the top card feel live. */}
          <div
            className={cn(
              'flex items-center gap-4 opacity-0 transition-all duration-400 ease-[var(--ease-apple)]',
              'translate-y-1 group-hover:translate-y-0 group-hover:opacity-100',
              'group-focus-within:translate-y-0 group-focus-within:opacity-100',
            )}
          >
            <button
              type="button"
              onClick={() => onBook?.(service)}
              className="relative z-10 text-[12px] font-medium text-accent underline-offset-4 transition-colors duration-200 hover:underline lg:text-[14px]"
            >
              Book this
            </button>
            <span className="text-[12px] text-text-subtle lg:text-[14px]">Details →</span>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
