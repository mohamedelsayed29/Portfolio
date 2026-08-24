import { useRef, useState } from 'react'
import { useLanguage } from '@/i18n'
import { useMediaQuery, usePrefersReducedMotion } from '@hooks'
import { MobileServiceCarousel } from './MobileServiceCarousel'
import { ServiceCard } from './ServiceCard'
import { getDesktopCardState } from './serviceMotion'
import { useDeckPointerMotion } from './useDeckPointerMotion'

/**
 * Chooses by both available space and input capability. A wide touch device
 * receives the drag model; a precise pointer receives the connected stack.
 */
export function ServiceDeck({ services, onBook }) {
  const { isRTL } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const hasDesktopSpace = useMediaQuery('(min-width: 960px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1200px)')
  const hasFinePointer = useMediaQuery('(any-hover: hover) and (any-pointer: fine)')
  const desktopStack = hasDesktopSpace && hasFinePointer
  const restingIndex = Math.floor(services.length / 2)
  const [activeIndex, setActiveIndex] = useState(restingIndex)
  const deckRef = useRef(null)
  const pointerMotion = useDeckPointerMotion(deckRef, reduced, desktopStack)

  if (!desktopStack) {
    return <MobileServiceCarousel services={services} onBook={onBook} reduced={reduced} />
  }

  return (
    <div
      ref={deckRef}
      className="relative h-[24rem] select-none md:block lg:h-[29rem] xl:h-[31rem]"
      style={{ perspective: '1200px' }}
      onPointerLeave={() => {
        setActiveIndex(restingIndex)
        pointerMotion.release()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(restingIndex)
      }}
    >
      {/* Keyed on direction so a runtime language toggle re-springs the fan
          cleanly instead of animating cards across the whole deck. */}
      <div
        key={isRTL ? 'rtl' : 'ltr'}
        className="grid h-full place-items-center [transform-style:preserve-3d]"
      >
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            index={index}
            service={service}
            state={getDesktopCardState(
              index,
              reduced ? null : activeIndex,
              services.length,
              isLargeDesktop,
              isRTL ? -1 : 1,
            )}
            isActive={activeIndex === index}
            reduced={reduced}
            onActivate={() => setActiveIndex(index)}
            onPointerActivate={(element, clientX, clientY) =>
              pointerMotion.activate(element, clientX, clientY)
            }
            onPointerUpdate={(clientX, clientY) => pointerMotion.update(clientX, clientY)}
            onBook={onBook}
          />
        ))}
      </div>
    </div>
  )
}
