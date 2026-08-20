import { useMediaQuery } from './useMediaQuery'

/**
 * Every decorative animation in the app checks this. Motion is a garnish, so
 * when the OS says "no", components render their final state immediately.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
