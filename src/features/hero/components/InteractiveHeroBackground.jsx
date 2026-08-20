import { useEffect, useRef } from 'react'
import { createLiquidHeroFragmentShader, HERO_VERTEX_SHADER } from '../shaders/liquidHeroShaders'

const FULLSCREEN_QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
const NEUTRAL_POINTER = { x: 0.5, y: 0.54 }
const CLICK_DURATION_SECONDS = 1.55

function getQualityProfile(width) {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches

  if (coarsePointer || width < 640) {
    return { octaves: 3, dprCap: 1.35, resolutionScale: 0.72 }
  }

  if (width < 1024) {
    return { octaves: 4, dprCap: 1.5, resolutionScale: 0.78 }
  }

  return { octaves: 5, dprCap: 1.6, resolutionScale: 0.82 }
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to allocate a WebGL shader.')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error.'
    gl.deleteShader(shader)
    throw new Error(message)
  }

  return shader
}

function createProgram(gl, octaves) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, HERO_VERTEX_SHADER)
  let fragmentShader

  try {
    fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      createLiquidHeroFragmentShader(octaves),
    )
  } catch (error) {
    gl.deleteShader(vertexShader)
    throw error
  }
  const program = gl.createProgram()

  if (!program) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error('Unable to allocate a WebGL program.')
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || 'Unknown shader linking error.'
    gl.deleteProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    throw new Error(message)
  }

  return { program, vertexShader, fragmentShader }
}

function uniformLocations(gl, program) {
  return {
    time: gl.getUniformLocation(program, 'u_time'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    trailPointer: gl.getUniformLocation(program, 'u_trailPointer'),
    pointerVelocity: gl.getUniformLocation(program, 'u_pointerVelocity'),
    interaction: gl.getUniformLocation(program, 'u_interaction'),
    clickPosition: gl.getUniformLocation(program, 'u_clickPosition'),
    clickAge: gl.getUniformLocation(program, 'u_clickAge'),
  }
}

/**
 * Decorative, single-draw-call WebGL artwork. React owns only its lifecycle;
 * animation values live in refs, local variables and shader uniforms.
 */
export function InteractiveHeroBackground({ containerRef, reducedMotion }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined

    const initialWidth = Math.max(container.clientWidth, 1)
    const quality = getQualityProfile(initialWidth)
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: quality.octaves === 5 ? 'high-performance' : 'low-power',
    })

    if (!gl) return undefined

    let resources
    try {
      resources = createProgram(gl, quality.octaves)
    } catch (error) {
      if (import.meta.env.DEV) console.error('[Hero WebGL]', error)
      return undefined
    }

    const { program, vertexShader, fragmentShader } = resources
    const positionBuffer = gl.createBuffer()
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const uniforms = uniformLocations(gl, program)

    if (!positionBuffer || positionLocation < 0) {
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      return undefined
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    let frame = 0
    let isIntersecting = true
    let isDocumentVisible = !document.hidden
    let isContextLost = false
    let pointerInside = false
    let hasRendered = false
    let lastTime = performance.now()
    let elapsedTime = 13.7
    let clickStartedAt = -Infinity
    let rect = container.getBoundingClientRect()

    const targetPointer = { ...NEUTRAL_POINTER }
    const currentPointer = { ...NEUTRAL_POINTER }
    const trailPointer = { ...NEUTRAL_POINTER }
    const previousPointer = { ...NEUTRAL_POINTER }
    const velocity = { x: 0, y: 0 }
    const clickPosition = { ...NEUTRAL_POINTER }
    let interaction = 0

    const resize = () => {
      rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dprCap)
      const width = Math.max(1, Math.round(rect.width * dpr * quality.resolutionScale))
      const height = Math.max(1, Math.round(rect.height * dpr * quality.resolutionScale))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }

      if (reducedMotion) draw(performance.now(), true)
    }

    const setPointerFromEvent = (event) => {
      if (event.pointerType === 'touch' || rect.width <= 0 || rect.height <= 0) return
      targetPointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      targetPointer.y = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    }

    const onPointerEnter = (event) => {
      if (reducedMotion || event.pointerType === 'touch') return
      rect = container.getBoundingClientRect()
      setPointerFromEvent(event)
      pointerInside = true
    }

    const onPointerMove = (event) => {
      if (reducedMotion || event.pointerType === 'touch') return
      setPointerFromEvent(event)
      pointerInside = true
    }

    const onPointerLeave = () => {
      pointerInside = false
      targetPointer.x = NEUTRAL_POINTER.x
      targetPointer.y = NEUTRAL_POINTER.y
    }

    const onPointerDown = (event) => {
      if (
        reducedMotion ||
        event.pointerType === 'touch' ||
        event.target.closest('a, button, input, select, textarea, [data-hero-content]')
      ) {
        return
      }

      setPointerFromEvent(event)
      clickPosition.x = targetPointer.x
      clickPosition.y = targetPointer.y
      clickStartedAt = performance.now()
    }

    function draw(now, forceStatic = false) {
      const rawDelta = Math.min((now - lastTime) / 1000, 0.05)
      const delta = forceStatic ? 0 : rawDelta
      lastTime = now
      elapsedTime += delta

      if (!reducedMotion) {
        const pointerDamping = 1 - Math.exp(-delta * 8.2)
        const trailDamping = 1 - Math.exp(-delta * 2.7)
        const interactionDamping = 1 - Math.exp(-delta * 3.8)

        currentPointer.x += (targetPointer.x - currentPointer.x) * pointerDamping
        currentPointer.y += (targetPointer.y - currentPointer.y) * pointerDamping
        trailPointer.x += (currentPointer.x - trailPointer.x) * trailDamping
        trailPointer.y += (currentPointer.y - trailPointer.y) * trailDamping
        interaction += ((pointerInside ? 1 : 0) - interaction) * interactionDamping

        const frameVelocityX = (currentPointer.x - previousPointer.x) / Math.max(delta, 0.001)
        const frameVelocityY = (currentPointer.y - previousPointer.y) / Math.max(delta, 0.001)
        const velocityLength = Math.hypot(frameVelocityX, frameVelocityY)
        const velocityScale = velocityLength > 1.35 ? 1.35 / velocityLength : 1
        const velocityDamping = 1 - Math.exp(-delta * 7.0)
        const targetVelocityX = pointerInside ? frameVelocityX * velocityScale * 0.74 : 0
        const targetVelocityY = pointerInside ? frameVelocityY * velocityScale * 0.74 : 0

        velocity.x += (targetVelocityX - velocity.x) * velocityDamping
        velocity.y += (targetVelocityY - velocity.y) * velocityDamping
        previousPointer.x = currentPointer.x
        previousPointer.y = currentPointer.y
      }

      const clickAge = (now - clickStartedAt) / 1000
      gl.useProgram(program)
      gl.uniform1f(uniforms.time, reducedMotion ? 13.7 : elapsedTime)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform2f(uniforms.pointer, currentPointer.x, currentPointer.y)
      gl.uniform2f(uniforms.trailPointer, trailPointer.x, trailPointer.y)
      gl.uniform2f(uniforms.pointerVelocity, velocity.x, velocity.y)
      gl.uniform1f(uniforms.interaction, reducedMotion ? 0 : interaction)
      gl.uniform2f(uniforms.clickPosition, clickPosition.x, clickPosition.y)
      gl.uniform1f(
        uniforms.clickAge,
        clickAge >= 0 && clickAge <= CLICK_DURATION_SECONDS ? clickAge : -1,
      )
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (!hasRendered) {
        hasRendered = true
        canvas.classList.add('is-ready')
      }
    }

    const tick = (now) => {
      frame = 0
      if (!isIntersecting || !isDocumentVisible || isContextLost || reducedMotion) return
      draw(now)
      frame = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (frame || reducedMotion || isContextLost || !isIntersecting || !isDocumentVisible) return
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden
      if (isDocumentVisible) startLoop()
      else stopLoop()
    }

    const onContextLost = () => {
      isContextLost = true
      stopLoop()
      canvas.classList.remove('is-ready')
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        if (isIntersecting) startLoop()
        else stopLoop()
      },
      { threshold: 0 },
    )

    resizeObserver.observe(container)
    intersectionObserver.observe(container)
    container.addEventListener('pointerenter', onPointerEnter, { passive: true })
    container.addEventListener('pointermove', onPointerMove, { passive: true })
    container.addEventListener('pointerleave', onPointerLeave, { passive: true })
    container.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    canvas.addEventListener('webglcontextlost', onContextLost)

    resize()
    if (reducedMotion) draw(performance.now(), true)
    else startLoop()

    return () => {
      stopLoop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.disableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      canvas.classList.remove('is-ready')
    }
  }, [containerRef, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-art-canvas pointer-events-none absolute inset-0 z-0 size-full"
    />
  )
}

export default InteractiveHeroBackground
