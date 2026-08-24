export const CARD_SPRING = {
  type: 'spring',
  stiffness: 380,
  damping: 36,
  mass: 0.68,
  restDelta: 0.01,
  restSpeed: 0.05,
}

export const CAROUSEL_SPRING = {
  type: 'spring',
  stiffness: 360,
  damping: 34,
  mass: 0.82,
}

export const REDUCED_TRANSITION = { duration: 0.01 }

export function getServiceArtStyle(service) {
  const art = service.art ?? {}

  return {
    '--service-primary': art.primary ?? service.accent,
    '--service-secondary': art.secondary ?? service.accent,
    '--service-primary-rgb': art.primaryRgb ?? '85 214 255',
    '--service-secondary-rgb': art.secondaryRgb ?? '65 105 255',
  }
}

const ACTIVE_SCALE = 1.045
const ACTIVE_LIFT = 15
const NEIGHBOR_PRESSURE = 18

/**
 * The irregularities are deliberate. They give every card a resting posture
 * while keeping the interaction itself governed by one consistent system.
 */
const CARD_PERSONALITIES = [
  { rotate: -3.2, y: 11, scale: 0.976, z: 2 },
  { rotate: 1.7, y: -4, scale: 0.992, z: 4 },
  { rotate: -1.1, y: 7, scale: 0.986, z: 6 },
  { rotate: 0.6, y: -3, scale: 1, z: 7 },
  { rotate: -2.3, y: 10, scale: 0.981, z: 5 },
  { rotate: 2.8, y: 3, scale: 0.972, z: 3 },
]

function personalityAt(index) {
  return CARD_PERSONALITIES[index % CARD_PERSONALITIES.length]
}

export function getDesktopCardState(index, activeIndex, count, isLargeDesktop = false, dirSign = 1) {
  const personality = personalityAt(index)
  const centre = (count - 1) / 2
  const stackStep = isLargeDesktop ? 52 : 48
  const baseX = (index - centre) * stackStep

  if (activeIndex === null) {
    return {
      x: `${dirSign * baseX}%`,
      y: personality.y,
      rotate: personality.rotate,
      scale: personality.scale,
      opacity: 1,
      zIndex: personality.z,
    }
  }

  const delta = index - activeIndex
  const distance = Math.abs(delta)

  if (distance === 0) {
    return {
      x: `${dirSign * baseX}%`,
      y: personality.y - ACTIVE_LIFT,
      rotate: 0,
      scale: ACTIVE_SCALE,
      opacity: 1,
      zIndex: 40,
    }
  }

  const direction = Math.sign(delta)
  const pressure = NEIGHBOR_PRESSURE / Math.pow(distance, 0.82)

  return {
    x: `${dirSign * (baseX + direction * pressure)}%`,
    y: personality.y + Math.max(1, 5 - distance),
    rotate: personality.rotate + (direction * 0.65) / distance,
    scale: personality.scale - Math.max(0, 0.012 - distance * 0.002),
    opacity: 1,
    zIndex: 20 - distance,
  }
}

export function getCarouselMetrics(viewportWidth) {
  if (viewportWidth >= 640) {
    return {
      cardWidth: Math.min(380, Math.max(300, viewportWidth * 0.48)),
      gap: 20,
    }
  }

  return {
    cardWidth: Math.min(344, Math.max(260, viewportWidth * 0.84)),
    gap: 16,
  }
}

export function clampIndex(index, count) {
  return Math.min(count - 1, Math.max(0, index))
}
