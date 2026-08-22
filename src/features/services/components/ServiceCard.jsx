import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@lib/cn'
import { SERVICE_ICONS } from '../icons'
import { CARD_SPRING, REDUCED_TRANSITION, getServiceArtStyle } from './serviceMotion'

export function ServiceArtwork({ Icon }) {
  if (!Icon) return null

  return (
    <div className="service-card__art" aria-hidden="true">
      <span className="service-card__orbit service-card__orbit--outer" />
      <span className="service-card__orbit service-card__orbit--inner" />
      <span className="service-card__beam" />
      <span className="service-card__glyph-halo" />
      <Icon className="service-card__glyph" strokeWidth={0.72} />
    </div>
  )
}

/**
 * Desktop service card. Stack motion is owned by the outer element while the
 * inner surface carries a tiny pointer response. Both paths use transforms,
 * and live pointer values never enter React state.
 */
export function ServiceCard({
  service,
  index,
  state,
  isActive,
  reduced,
  onActivate,
  onPointerActivate,
  onPointerUpdate,
  onBook,
}) {
  const Icon = SERVICE_ICONS[service.icon]

  const handlePointerEnter = (event) => {
    onActivate()
    if (!reduced && event.pointerType !== 'touch') {
      onPointerActivate(event.currentTarget, event.clientX, event.clientY)
    }
  }

  const handlePointerMove = (event) => {
    if (reduced || event.pointerType === 'touch') return
    onPointerUpdate(event.clientX, event.clientY)
  }

  return (
    <motion.div
      initial={false}
      animate={{
        x: state.x,
        y: state.y,
        rotate: reduced ? 0 : state.rotate,
        scale: reduced ? 1 : state.scale,
        opacity: reduced ? 1 : state.opacity,
      }}
      transition={reduced ? REDUCED_TRANSITION : CARD_SPRING}
      style={{ zIndex: isActive ? 40 : state.zIndex, ...getServiceArtStyle(service) }}
      className="service-card-shell relative [grid-area:1/1] h-[clamp(22rem,29vw,27rem)] w-[clamp(18rem,25.5vw,23.75rem)]"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onFocusCapture={onActivate}
    >
      <span
        aria-hidden="true"
        className={cn('service-card__outer-glow', isActive && 'service-card__outer-glow--active')}
      />

      <article
        data-service={service.id}
        className={cn(
          'service-card group relative z-[1] flex h-full w-full flex-col overflow-hidden rounded-[28px] border p-6 lg:rounded-[32px] lg:p-7 xl:p-8',
          isActive && 'service-card--active',
        )}
      >
        <span aria-hidden="true" className="service-card__top-sheen" />
        <span aria-hidden="true" className="service-card__wash" />
        <span aria-hidden="true" className="service-card__pointer-light" />
        <span aria-hidden="true" className="service-card__active-edge" />

        <ServiceArtwork Icon={Icon} />
        <span aria-hidden="true" className="service-card__index">
          0{index + 1} / 06
        </span>

        <Link
          to={`/services#${service.id}`}
          className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--service-primary)] focus-visible:ring-inset lg:rounded-[32px]"
          aria-label={`${service.title}, details`}
        />

        <div className="relative z-[2] flex items-center justify-between">
          <span className="service-card__icon-chip grid size-12 place-items-center rounded-[15px] border lg:size-13">
            {Icon && <Icon className="size-5 lg:size-[22px]" strokeWidth={1.6} aria-hidden="true" />}
          </span>
          <span className="service-card__label text-[9px] font-medium tracking-[0.18em] uppercase">
            Studio service
          </span>
        </div>

        <div className="service-card__content relative z-[2] mt-auto min-h-[10rem] lg:min-h-[11.25rem]">
          <span
            aria-hidden="true"
            className="mb-4 block h-px w-10 bg-[var(--service-primary)] shadow-[0_0_12px_rgb(var(--service-primary-rgb)/0.45)]"
          />
          <h3 className="max-w-[14ch] text-[21px] leading-[1.08] font-semibold tracking-[-0.035em] lg:text-[24px] xl:text-[27px]">
            {service.title}
          </h3>

          <motion.p
            aria-hidden={!isActive}
            animate={{ opacity: isActive ? 1 : 0.72, y: isActive && !reduced ? 0 : 3 }}
            transition={reduced ? REDUCED_TRANSITION : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="service-card__description mt-3 line-clamp-3 text-[12px] leading-[1.55] lg:text-[13px] xl:text-[14px]"
          >
            {service.summary}
          </motion.p>

          <motion.div
            aria-hidden={!isActive}
            animate={{ opacity: isActive ? 1 : 0, y: isActive && !reduced ? 0 : 6 }}
            transition={
              reduced
                ? REDUCED_TRANSITION
                : { duration: 0.2, delay: isActive ? 0.035 : 0, ease: [0.16, 1, 0.3, 1] }
            }
            className={cn(
              'mt-3 flex items-center gap-4 text-[11px] font-medium lg:text-[12px] xl:text-[13px]',
              isActive ? 'pointer-events-auto' : 'pointer-events-none',
            )}
          >
            <button
              type="button"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onBook?.(service)}
              className="service-card__book relative z-20 underline-offset-4 hover:underline"
            >
              Book this
            </button>
            <span className="service-card__details flex items-center gap-1">
              Details <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </span>
          </motion.div>
        </div>
      </article>
    </motion.div>
  )
}
