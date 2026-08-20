import { useCallback, useEffect, useRef } from 'react'

const RESPONSE = 18
const SETTLE_EPSILON = 0.0015

const clampPointer = (value) => Math.max(-1, Math.min(1, value))

/**
 * Owns the deck's only custom animation-frame loop. Pointer events only update
 * targets; one time-based interpolation step writes compositor-only transforms
 * to the active card and its fixed gradient highlight.
 */
export function useDeckPointerMotion(deckRef, reduced, enabled = true) {
  const stateRef = useRef({
    activeShell: null,
    surface: null,
    light: null,
    bounds: null,
    frame: null,
    lastTime: 0,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    releasing: false,
    sectionVisible: true,
    pageVisible: typeof document === 'undefined' || document.visibilityState === 'visible',
  })

  const clearFrame = useCallback(() => {
    const state = stateRef.current
    if (state.frame !== null) cancelAnimationFrame(state.frame)
    state.frame = null
    state.lastTime = 0
  }, [])

  const clearElements = useCallback(() => {
    const state = stateRef.current

    if (state.surface) {
      state.surface.style.removeProperty('transform')
      state.surface.style.removeProperty('will-change')
    }

    if (state.light) {
      state.light.style.removeProperty('transform')
      state.light.style.removeProperty('will-change')
    }

    state.activeShell = null
    state.surface = null
    state.light = null
    state.bounds = null
    state.currentX = 0
    state.currentY = 0
    state.targetX = 0
    state.targetY = 0
    state.releasing = false
  }, [])

  const renderFrameRef = useRef(null)

  const scheduleFrame = useCallback(() => {
    const state = stateRef.current
    if (
      !enabled ||
      reduced ||
      !state.sectionVisible ||
      !state.pageVisible ||
      !state.surface ||
      state.frame !== null
    ) {
      return
    }

    state.frame = requestAnimationFrame((time) => renderFrameRef.current?.(time))
  }, [enabled, reduced])

  const renderFrame = useCallback(
    (time) => {
      const state = stateRef.current
      state.frame = null

      if (!enabled || reduced || !state.sectionVisible || !state.pageVisible || !state.surface) return

      const elapsed = state.lastTime ? Math.min(64, time - state.lastTime) : 16.7
      state.lastTime = time
      const blend = 1 - Math.exp((-RESPONSE * elapsed) / 1000)

      state.currentX += (state.targetX - state.currentX) * blend
      state.currentY += (state.targetY - state.currentY) * blend

      const x = state.currentX
      const y = state.currentY

      state.surface.style.transform = `translate3d(${(x * 2).toFixed(3)}px, ${(y * 1.5).toFixed(3)}px, 0) rotateX(${(-y).toFixed(3)}deg) rotateY(${(x * 1.35).toFixed(3)}deg)`

      if (state.light) {
        state.light.style.transform = `translate3d(calc(-50% + ${(x * 62).toFixed(2)}px), calc(-50% + ${(y * 54).toFixed(2)}px), 0)`
      }

      const unsettled =
        Math.abs(state.targetX - x) > SETTLE_EPSILON ||
        Math.abs(state.targetY - y) > SETTLE_EPSILON

      if (unsettled) {
        scheduleFrame()
      } else if (state.releasing) {
        clearElements()
      } else {
        state.lastTime = 0
      }
    },
    [clearElements, enabled, reduced, scheduleFrame],
  )

  useEffect(() => {
    renderFrameRef.current = renderFrame
    return () => {
      renderFrameRef.current = null
    }
  }, [renderFrame])

  const setTargetFromPoint = useCallback((clientX, clientY) => {
    const state = stateRef.current
    const bounds = state.bounds
    if (!bounds) return

    state.targetX = clampPointer(((clientX - bounds.left) / bounds.width - 0.5) * 2)
    state.targetY = clampPointer(((clientY - bounds.top) / bounds.height - 0.5) * 2)
  }, [])

  const activate = useCallback(
    (shell, clientX, clientY) => {
      if (!enabled || reduced || !shell) return

      const state = stateRef.current
      if (state.activeShell !== shell) {
        clearFrame()
        clearElements()

        state.activeShell = shell
        state.surface = shell.querySelector('.service-card')
        state.light = shell.querySelector('.service-card__pointer-light')
        state.bounds = shell.getBoundingClientRect()

        if (state.surface) state.surface.style.willChange = 'transform'
        if (state.light) state.light.style.willChange = 'transform'
      }

      state.releasing = false
      setTargetFromPoint(clientX, clientY)
      scheduleFrame()
    },
    [clearElements, clearFrame, enabled, reduced, scheduleFrame, setTargetFromPoint],
  )

  const update = useCallback(
    (clientX, clientY) => {
      const state = stateRef.current
      if (!state.activeShell || !enabled || reduced) return
      setTargetFromPoint(clientX, clientY)
      scheduleFrame()
    },
    [enabled, reduced, scheduleFrame, setTargetFromPoint],
  )

  const release = useCallback(() => {
    const state = stateRef.current
    if (!state.surface) return
    state.targetX = 0
    state.targetY = 0
    state.releasing = true
    scheduleFrame()
  }, [scheduleFrame])

  useEffect(() => {
    if (!enabled) {
      clearFrame()
      clearElements()
      return undefined
    }

    const deck = deckRef.current
    if (!deck) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        const state = stateRef.current
        state.sectionVisible = entry.isIntersecting
        if (!entry.isIntersecting) {
          clearFrame()
          clearElements()
        }
      },
      { threshold: 0.04 },
    )

    const resizeObserver = new ResizeObserver(() => {
      const state = stateRef.current
      if (state.activeShell) state.bounds = state.activeShell.getBoundingClientRect()
    })

    const handleVisibility = () => {
      const state = stateRef.current
      state.pageVisible = document.visibilityState === 'visible'
      if (!state.pageVisible) {
        clearFrame()
        clearElements()
      }
    }

    observer.observe(deck)
    resizeObserver.observe(deck)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      clearFrame()
      clearElements()
    }
  }, [clearElements, clearFrame, deckRef, enabled])

  useEffect(() => {
    if (!enabled || reduced) {
      clearFrame()
      clearElements()
    }
  }, [clearElements, clearFrame, enabled, reduced])

  return { activate, update, release }
}
