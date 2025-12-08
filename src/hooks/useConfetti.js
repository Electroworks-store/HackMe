import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

/**
 * useConfetti - Hook that triggers a confetti celebration effect
 * Fires once on mount to celebrate challenge completion
 */
export default function useConfetti() {
  const hasFired = useRef(false)

  useEffect(() => {
    // Only fire once
    if (hasFired.current) return
    hasFired.current = true

    // Small delay for better UX (let the UI render first)
    const timeout = setTimeout(() => {
      // First burst from the left
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#00ff88', '#00aaff', '#ffaa00', '#ff4444', '#aa00ff']
      })

      // Second burst from the right
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#00ff88', '#00aaff', '#ffaa00', '#ff4444', '#aa00ff']
        })
      }, 150)

      // Center burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#00ff88', '#00aaff', '#ffaa00']
        })
      }, 300)

    }, 200)

    return () => clearTimeout(timeout)
  }, [])
}
