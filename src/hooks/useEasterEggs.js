import { useEffect, useRef, useState } from 'react'

// Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

// Matrix rain effect easter egg
function startMatrixRain() {
  const canvas = document.createElement('canvas')
  canvas.id = 'matrix-rain'
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.8;
  `
  document.body.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const chars = 'HACKMELAB01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  const charArray = chars.split('')
  const fontSize = 14
  const columns = canvas.width / fontSize
  const drops = Array(Math.floor(columns)).fill(1)
  
  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#00ff88'
    ctx.font = `${fontSize}px monospace`
    
    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }
  
  const interval = setInterval(draw, 35)
  
  // Stop after 8 seconds
  setTimeout(() => {
    clearInterval(interval)
    canvas.remove()
  }, 8000)
}

// Console easter egg messages
function initConsoleEasterEggs() {
  // Main banner
  console.log('%c🔒 HackMe Lab', 'font-size: 24px; font-weight: bold; color: #00ff88;')
  console.log('%cWelcome, curious hacker! 👀', 'font-size: 14px; color: #888;')
  console.log('%cYou found the console - that\'s the spirit!', 'font-size: 12px; color: #666;')
  console.log('')
  console.log('%c💡 Pro tips:', 'font-size: 14px; color: #00aaff;')
  console.log('%c• Try the Konami code for a surprise... ↑↑↓↓←→←→BA', 'font-size: 12px; color: #888;')
  console.log('%c• Check out window.hackmelab for some goodies', 'font-size: 12px; color: #888;')
  console.log('%c• Type hackmelab.hint() for a secret hint', 'font-size: 12px; color: #888;')
  console.log('')
  console.log('%c⚠️ Remember: Only hack things you have permission to hack!', 'font-size: 12px; color: #ffaa00;')
  
  // Set up global helpers
  window.hackmelab = {
    version: '1.0.0',
    hint: () => {
      console.log('%c🔮 Secret Hint:', 'font-size: 14px; color: #ff00ff;')
      console.log('%cHave you tried looking at the network tab during login?', 'font-size: 12px; color: #888;')
      console.log('%cOr maybe... inspecting the source of each challenge?', 'font-size: 12px; color: #888;')
      return '🤫 Shh... keep exploring!'
    },
    credits: () => {
      console.log('%c✨ Made with ❤️ by the RootLabs team', 'font-size: 14px; color: #00ff88;')
      console.log('%cThank you for learning ethical hacking!', 'font-size: 12px; color: #888;')
      return '👾'
    },
    matrix: () => {
      console.log('%c💊 You took the red pill...', 'font-size: 14px; color: #00ff88;')
      startMatrixRain()
      return 'Wake up, Neo...'
    },
    flag: 'FLAG{c0ns0l3_3xpl0r3r}',
    secrets: {
      get: function() {
        console.log('%c🏴 Hidden Flag Found!', 'font-size: 14px; color: #ff00ff;')
        return 'FLAG{d3v_t00ls_m4st3r}'
      }
    }
  }
}

export function useEasterEggs() {
  const [konamiActivated, setKonamiActivated] = useState(false)
  const inputSequence = useRef([])
  
  useEffect(() => {
    // Initialize console easter eggs on mount
    initConsoleEasterEggs()
    
    // Konami code listener
    function handleKeyDown(e) {
      inputSequence.current.push(e.code)
      
      // Keep only the last N keys
      if (inputSequence.current.length > KONAMI_CODE.length) {
        inputSequence.current.shift()
      }
      
      // Check if matches Konami code
      const currentSequence = inputSequence.current.join(',')
      const konamiSequence = KONAMI_CODE.join(',')
      
      if (currentSequence === konamiSequence) {
        setKonamiActivated(true)
        console.log('%c🎮 KONAMI CODE ACTIVATED!', 'font-size: 20px; color: #ff00ff;')
        startMatrixRain()
        inputSequence.current = []
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  return { konamiActivated }
}

export default useEasterEggs
