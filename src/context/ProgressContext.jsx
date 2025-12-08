import { createContext, useContext, useState, useEffect } from 'react'

const ProgressContext = createContext(null)

const STORAGE_KEY = 'hacklab-progress'

const initialProgress = {
  'sql-login': { completed: false, timestamp: null },
  'idor': { completed: false, timestamp: null },
  'robots-cookie': { completed: false, timestamp: null },
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
