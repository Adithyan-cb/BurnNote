import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const COLLAPSE_START = {
  gentle: 2.4,
  inferno: 1.9,
  dissolve: 2.8,
}

/**
 * The burn & release sequence (adapted from the "Thought Burner" ritual):
 *   1. ignition   — halo/kero glow ramps (CSS layer, driven by a class)
 *   2. cinders    — ember/ash particles are spawned at the start
 *   3. combustion — ink chars to ember-orange, blurs, drifts upward, fades
 *   4. collapse   — the parchment envelope sinks into ash, then onComplete
 */
export function useBurn({ intensity, onComplete }) {
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    const collapse = COLLAPSE_START[intensity] ?? COLLAPSE_START.inferno
    const timeline = gsap.timeline({
      onComplete: () => onCompleteRef.current(),
    })

    // Stage 3: the ink catches fire
    timeline
      .to('.burn-ink', {
        color: '#ffb95f',
        textShadow: '0 0 14px #ea580c, 0 0 24px #f97316',
        filter: 'blur(2px)',
        y: -14,
        duration: 1.4,
        ease: 'power2.inOut',
      })
      // burned-through line sinks and scatters
      .to(
        '.burn-ink',
        {
          opacity: 0,
          filter: 'blur(10px)',
          y: -38,
          scale: 0.92,
          duration: 1,
          ease: 'power2.in',
        },
        0.75,
      )

    // Stage 4: the card collapses into ash
    timeline.to(
      '.burn-card',
      {
        opacity: 0,
        scale: 0.85,
        y: 20,
        duration: 0.6,
        ease: 'power2.in',
      },
      collapse,
    )

    return () => {
      timeline.kill()
    }
  }, [intensity])

  return null
}
