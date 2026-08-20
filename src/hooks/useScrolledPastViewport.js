import { useEffect, useState } from 'react'

/**
 * True once the page has scrolled past `ratio` of the viewport height. The nav
 * uses this to know it is no longer sitting on top of the full-height hero
 * panel — a fixed pixel threshold would be wrong on every other screen size.
 */
export function useScrolledPastViewport(ratio = 0.8) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0

    const evaluate = () => {
      frame = 0
      setPast(window.scrollY > window.innerHeight * ratio)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(evaluate)
    }

    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ratio])

  return past
}
