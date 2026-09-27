import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@lib/cn'
import { localizedPath, useLanguage, useStrings } from '@/i18n'
import { SERVICE_ICONS } from '../icons'
import { CARD_STRINGS } from './cardStrings'
import { ServiceArtwork } from './ServiceCard'
import {
  CAROUSEL_SPRING,
  REDUCED_TRANSITION,
  clampIndex,
  getCarouselMetrics,
  getServiceArtStyle,
} from './serviceMotion'

const initialWidth = () => {
  if (typeof window === 'undefined') return 320
  return Math.max(272, window.innerWidth)
}

const CAROUSEL_STRINGS = {
  en: {
    regionLabel: 'Services',
    roleDescription: 'carousel',
    status: (current, total, title) => `Service ${current} of ${total}: ${title}`,
  },
  ar: {
    regionLabel: 'الخدمات',
    roleDescription: 'عرض دوّار',
    status: (current, total, title) => `الخدمة ${current} من ${total}: ${title}`,
  },
}

function MobileServiceCard({
  service,
  index,
  language,
  cardWidth,
  signedStride,
  trackX,
  isActive,
  reduced,
  onFocus,
  onBook,
}) {
  const Icon = SERVICE_ICONS[service.icon]
  const s = useStrings(CARD_STRINGS)
  const distanceFromCentre = useTransform(trackX, (value) => index - value / signedStride)
  const scale = useTransform(distanceFromCentre, (distance) =>
    reduced ? 1 : Math.max(0.945, 1 - Math.abs(distance) * 0.045),
  )
  const y = useTransform(distanceFromCentre, (distance) =>
    reduced ? 0 : Math.min(8, Math.abs(distance) * 7),
  )
  const rotate = useTransform(distanceFromCentre, (distance) =>
    reduced ? 0 : Math.max(-1.8, Math.min(1.8, distance * 1.45)),
  )
  const opacity = useTransform(distanceFromCentre, (distance) =>
    Math.max(0.9, 1 - Math.abs(distance) * 0.075),
  )
  const detailOpacity = useTransform(distanceFromCentre, (distance) =>
    reduced ? (Math.abs(distance) < 0.45 ? 1 : 0) : Math.max(0, 1 - Math.abs(distance) * 1.7),
  )
  const detailY = useTransform(distanceFromCentre, (distance) =>
    reduced ? 0 : Math.min(8, Math.abs(distance) * 8),
  )

  return (
    <motion.article
      style={{
        ...getServiceArtStyle(service),
        width: cardWidth,
        height: Math.max(340, Math.round(cardWidth * 1.12)),
        scale,
        y,
        rotate,
        opacity,
      }}
      className={cn(
        'service-card service-card--mobile relative flex shrink-0 flex-col overflow-hidden rounded-[30px] border p-7',
        isActive && 'service-card--active',
      )}
      data-service={service.id}
      onFocusCapture={onFocus}
    >
      <span aria-hidden="true" className="service-card__top-sheen" />
      <span aria-hidden="true" className="service-card__wash" />
      <span aria-hidden="true" className="service-card__active-edge" />
      <ServiceArtwork Icon={Icon} />
      <span aria-hidden="true" className="service-card__index">
        0{index + 1} / 06
      </span>

      <Link
        to={localizedPath(`/services#${service.id}`, language)}
        draggable="false"
        className="absolute inset-0 z-10 rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--service-primary)] focus-visible:ring-inset"
        aria-label={s.detailsAria(service.title)}
      />

      <span className="service-card__icon-chip relative z-[2] grid size-12 place-items-center rounded-[15px] border">
        {Icon && <Icon className="size-[22px]" strokeWidth={1.6} aria-hidden="true" />}
      </span>

      <div className="service-card__content relative z-[2] mt-auto min-h-[11.25rem]">
        <span
          aria-hidden="true"
          className="mb-4 block h-px w-10 bg-[var(--service-primary)] shadow-[0_0_12px_rgb(var(--service-primary-rgb)/0.45)]"
        />
        <h3 className="max-w-[14ch] text-[25px] leading-[1.08] font-semibold tracking-[-0.035em]">
          {service.title}
        </h3>

        <motion.p
          style={{ opacity: detailOpacity, y: detailY }}
          aria-hidden={!isActive}
          className="service-card__description mt-3 line-clamp-3 text-[13px] leading-[1.55]"
        >
          {service.summary}
        </motion.p>

        <motion.div
          style={{ opacity: detailOpacity, y: detailY }}
          aria-hidden={!isActive}
          className={cn(
            'mt-4 flex items-center gap-5 text-[13px] font-medium',
            isActive ? 'pointer-events-auto' : 'pointer-events-none',
          )}
        >
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onBook?.(service)}
            className="service-card__book relative z-20 underline-offset-4 hover:underline"
          >
            {s.book}
          </button>
          <span className="service-card__details flex items-center gap-1">
            {s.details} <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </span>
        </motion.div>
      </div>
    </motion.article>
  )
}

export function MobileServiceCarousel({ services, onBook, reduced }) {
  const { isRTL, language } = useLanguage()
  const s = useStrings(CAROUSEL_STRINGS)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const activeIndexRef = useRef(0)
  const suppressClickUntilRef = useRef(0)
  const animationRef = useRef(null)
  const demoteTimerRef = useRef(null)
  const trackX = useMotionValue(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [metrics, setMetrics] = useState(() => getCarouselMetrics(initialWidth()))
  const stride = metrics.cardWidth + metrics.gap
  /* In RTL the flex track lays cards out right-to-left, so advancing to the
     next card moves the track in +x instead of -x. One signed stride keeps
     every position, projection and constraint direction-correct. */
  const signedStride = isRTL ? stride : -stride
  const endX = (services.length - 1) * signedStride

  const promoteMovingLayers = useCallback(() => {
    if (demoteTimerRef.current !== null) clearTimeout(demoteTimerRef.current)
    demoteTimerRef.current = null
    trackRef.current?.classList.add('service-carousel__track--moving')
  }, [])

  const demoteMovingLayers = useCallback(
    (delay = reduced ? 0 : 720) => {
      if (demoteTimerRef.current !== null) clearTimeout(demoteTimerRef.current)
      demoteTimerRef.current = window.setTimeout(() => {
        trackRef.current?.classList.remove('service-carousel__track--moving')
        demoteTimerRef.current = null
      }, delay)
    },
    [reduced],
  )

  const settleTo = useCallback(
    (nextIndex, velocity = 0) => {
      const index = clampIndex(nextIndex, services.length)
      activeIndexRef.current = index
      setActiveIndex(index)
      animationRef.current?.stop()
      promoteMovingLayers()
      animationRef.current = animate(trackX, index * signedStride, {
        ...(reduced ? REDUCED_TRANSITION : CAROUSEL_SPRING),
        velocity: reduced ? 0 : velocity,
      })
      demoteMovingLayers()
    },
    [demoteMovingLayers, promoteMovingLayers, reduced, services.length, signedStride, trackX],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextMetrics = getCarouselMetrics(entry.contentRect.width)
      setMetrics(nextMetrics)
    })

    resizeObserver.observe(viewport)

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          animationRef.current?.stop()
          demoteMovingLayers(0)
        }
      },
      { threshold: 0.02 },
    )

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        animationRef.current?.stop()
        demoteMovingLayers(0)
      }
    }

    visibilityObserver.observe(viewport)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [demoteMovingLayers])

  useEffect(() => {
    animationRef.current?.stop()
    trackX.set(activeIndexRef.current * signedStride)
  }, [signedStride, trackX])

  useEffect(
    () => () => {
      animationRef.current?.stop()
      if (demoteTimerRef.current !== null) clearTimeout(demoteTimerRef.current)
      trackRef.current?.classList.remove('service-carousel__track--moving')
    },
    [],
  )

  const handleDragEnd = (_, info) => {
    const projectedX = trackX.get() + info.velocity.x * 0.16
    const targetIndex = Math.round(projectedX / signedStride)
    suppressClickUntilRef.current = performance.now() + 140
    settleTo(targetIndex, info.velocity.x)
  }

  const handleClickCapture = (event) => {
    if (performance.now() <= suppressClickUntilRef.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-roledescription={s.roleDescription}
      aria-label={s.regionLabel}
      className="-mx-6 overflow-hidden px-0 sm:-mx-8"
      style={{ touchAction: 'pan-y' }}
      onClickCapture={handleClickCapture}
    >
      <motion.div
        key={isRTL ? 'rtl' : 'ltr'}
        ref={trackRef}
        drag="x"
        dragConstraints={isRTL ? { left: 0, right: endX } : { left: endX, right: 0 }}
        dragElastic={0.075}
        dragMomentum={false}
        style={{
          x: trackX,
          gap: metrics.gap,
          paddingInline: `calc(50% - ${metrics.cardWidth / 2}px)`,
        }}
        onPointerDown={promoteMovingLayers}
        onPointerUp={() => demoteMovingLayers()}
        onDragStart={promoteMovingLayers}
        onDragEnd={handleDragEnd}
        onPointerCancel={() => settleTo(activeIndexRef.current)}
        className="flex cursor-grab select-none py-7 active:cursor-grabbing"
      >
        {services.map((service, index) => (
          <MobileServiceCard
            key={service.id}
              service={service}
              index={index}
              language={language}
            cardWidth={metrics.cardWidth}
            signedStride={signedStride}
            trackX={trackX}
            isActive={activeIndex === index}
            reduced={reduced}
            onFocus={() => settleTo(index)}
            onBook={onBook}
          />
        ))}
      </motion.div>
      <p aria-live="polite" className="sr-only">
        {s.status(activeIndex + 1, services.length, services[activeIndex]?.title)}
      </p>
    </div>
  )
}
