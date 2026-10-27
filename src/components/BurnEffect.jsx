import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { splitText } from '../lib/splitText'
import { ParticleSystem } from '../lib/particles'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './BurnEffect.css'

function BurnEffect({ text, onComplete }) {
  const containerRef = useRef(null)
  const textContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (!text || !containerRef.current || !textContainerRef.current) return

    const textContainer = textContainerRef.current
    textContainer.innerHTML = ''

    if (prefersReducedMotion) {
      // Reduced motion path - simple dissolve
      const dissolveDiv = document.createElement('div')
      dissolveDiv.className = 'burn-effect__text-dissolve'
      dissolveDiv.textContent = text
      textContainer.appendChild(dissolveDiv)

      const timeline = gsap.timeline({
        onComplete: () => onCompleteRef.current(),
      })

      timeline.to(dissolveDiv, {
        opacity: 0,
        filter: 'blur(4px)',
        duration: 1.5,
        ease: 'power2.out',
      })

      return () => {
        timeline.kill()
      }
    }

    // Use requestAnimationFrame to avoid layout thrashing
    requestAnimationFrame(() => {
      // Full animation path with per-character spans and particles
      const { chars, container } = splitText(text)
      container.className = 'burn-effect__chars'
      textContainer.appendChild(container)

      // Setup canvas particles
      const canvas = canvasRef.current
      if (canvas) {
        const rect = textContainer.getBoundingClientRect()
        canvas.width = rect.width || 600
        canvas.height = rect.height || 400
        particlesRef.current = new ParticleSystem(canvas)
        particlesRef.current.start()
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          if (particlesRef.current) {
            particlesRef.current.destroy()
          }
          onCompleteRef.current()
        },
      })

      // Burn chars from bottom to top - line by line, smoother
      timeline.to(
        chars,
        {
          color: '#FF6B2C',
          textShadow: '0 0 8px #FF6B2C, 0 0 12px #FFA040',
          filter: 'blur(0.3px)',
          duration: 0.15,
          stagger: {
            each: 0.002,
            from: 'end',
          },
          ease: 'power2.inOut',
        },
        0,
      )

      timeline.to(
        chars,
        {
          color: '#6B6560',
          textShadow: 'none',
          filter: 'blur(1.5px)',
          opacity: 0.5,
          duration: 0.25,
          stagger: {
            each: 0.002,
            from: 'end',
          },
          ease: 'power2.inOut',
        },
        0.4,
      )

      timeline.to(
        chars,
        {
          opacity: 0,
          filter: 'blur(3px)',
          y: -10,
          duration: 0.35,
          stagger: {
            each: 0.002,
            from: 'end',
          },
          ease: 'power2.out',
        },
        0.8,
      )

      // Stage 3: Particles
      const spawnParticles = (progress) => {
        if (!particlesRef.current || !textContainerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()
        const textRect = textContainerRef.current.getBoundingClientRect()
        const y = textRect.height * (1 - progress)
        for (let i = 0; i < 3; i++) {
          const x = Math.random() * textRect.width + textRect.left - containerRect.left
          particlesRef.current.emit(x, y + textRect.top - containerRect.top, Math.random() > 0.7 ? 'spark' : 'ember')
        }
      }

      timeline.call(() => spawnParticles(0.8), [], 0.3)
      timeline.call(() => spawnParticles(0.6), [], 0.9)
      timeline.call(() => spawnParticles(0.4), [], 1.4)

      // Ash particles
      timeline.call(() => {
        if (!particlesRef.current || !textContainerRef.current) return
        const textRect = textContainerRef.current.getBoundingClientRect()
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * textRect.width
          const y = 20
          particlesRef.current.emit(x, y, 'ash')
        }
      }, [], 1.6)

      timeline.to(
        textContainer,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        1.4,
      )

      return () => {
        timeline.kill()
        if (particlesRef.current) {
          particlesRef.current.destroy()
          particlesRef.current = null
        }
      }
    })
  }, [text, prefersReducedMotion])

  return (
    <div className="burn-effect" ref={containerRef}>
      <div className="burn-effect__text-only">
        <div className="burn-effect__text-container" ref={textContainerRef} />
      </div>
      <canvas ref={canvasRef} className="burn-effect__particles" aria-hidden="true" />
    </div>
  )
}

export default BurnEffect
