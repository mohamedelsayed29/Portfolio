import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router keeps scroll position across navigations. Reset it on route
 * change, but honour in-page hash links (/services#backend) by scrolling to
 * the target element instead.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
