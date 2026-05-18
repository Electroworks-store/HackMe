import { createContext, useContext, useState, useEffect } from 'react'

const ProgressContext = createContext(null)

const STORAGE_KEY = 'hacklab-progress'

const initialProgress = {
  // Chapter 1: Perimeter Breach
  'sql-login':           { completed: false, timestamp: null },
  'idor':                { completed: false, timestamp: null },
  'robots-cookie':       { completed: false, timestamp: null },
  'localstorage-auth':   { completed: false, timestamp: null },
  'base64-token':        { completed: false, timestamp: null },
  'js-backdoor':         { completed: false, timestamp: null },
  // Chapter 2: Deep Infiltration
  'two-part-heist':      { completed: false, timestamp: null },
  'xor-crypto':          { completed: false, timestamp: null },
  'hidden-message':      { completed: false, timestamp: null },
  'chat-lab':            { completed: false, timestamp: null },
  'fix-the-bug':         { completed: false, timestamp: null },
  'metadata-heist':      { completed: false, timestamp: null },
  // Chapter 3: The Inner Sanctum
  'ciphered-incident-log':      { completed: false, timestamp: null },
  'breached-chat-server':       { completed: false, timestamp: null },
  'operation-lost-credentials': { completed: false, timestamp: null },
  'prng-prediction':            { completed: false, timestamp: null },
  'canary-flag':                { completed: false, timestamp: null },
  'silent-record':              { completed: false, timestamp: null },
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    return initialProgress
  })

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }, [progress])

  const markCompleted = (challengeId) => {
    setProgress(prev => ({
      ...prev,
      [challengeId]: {
        completed: true,
        timestamp: new Date().toISOString(),
      },
    }))
  }

  const isCompleted = (challengeId) => {
    return progress[challengeId]?.completed || false
  }

  const getCompletedCount = () => {
    return Object.values(progress).filter(p => p.completed).length
  }

  const resetProgress = () => {
    setProgress(initialProgress)
  }

  const getAllProgress = () => {
    return progress
  }

  const value = {
    progress,
    markCompleted,
    isCompleted,
    getCompletedCount,
    resetProgress,
    getAllProgress,
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
