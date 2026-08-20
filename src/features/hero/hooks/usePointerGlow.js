import { useEffect } from 'react'

/**
 * Moves a soft light with the pointer across the hero panel.
 *
 * The glow is a separate element moved with `translate3d`, never a gradient
 * whose colour stops change — animating the panel's own multi-layer background
 * would repaint the full surface every frame, which is exactly the thing that
 * makes these effects feel heavy. A transform stays on the compositor.
 *
 * The pointer position is eased toward, so the light trails the cursor instead
 * of snapping to it, and the rAF loop parks itself once the two converge.
 */
export function usePointerGlow(panelRef, glowRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const panel = panelRef.current
    const glow = glowRef.current
    if (!panel || !glow) return undefined

    // Touch and pen would just leave the light stranded wherever the last tap was.
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    let rect = panel.getBoundingClientRect()
    let visible = true
    let started = false
    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const measure = () => {
      rect = panel.getBoundingClientRect()
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      glow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`

      const settled = Math.abs(targetX - currentX) < 0.5 && Math.abs(targetY - currentY) < 0.5
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const onPointerMove = (event) => {
      if (!visible) return

      targetX = event.clientX - rect.left
      targetY = event.clientY - rect.top

      if (!started) {
        // Land it under the cursor rather than sliding in from the corner.
        started = true
        currentX = targetX
        currentY = targetY
        glow.style.opacity = '1'
      }

      if (!frame) frame = requestAnimationFrame(tick)
    }

    // Stop doing any work once the panel has scrolled away.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) measure()
      },
      { threshold: 0 },
    )
    observer.observe(panel)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    // Cached so the move handler never forces a layout read.
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [panelRef, glowRef, enabled])
}
