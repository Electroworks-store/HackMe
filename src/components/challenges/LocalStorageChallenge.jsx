import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, HardDrive, User, ShieldAlert, XCircle, Lightbulb, EyeOff, RefreshCw } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './LocalStorageChallenge.css'

const STORAGE_KEY = 'hackme_user_session'

export default function LocalStorageChallenge() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [accessAttempt, setAccessAttempt] = useState(null)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('localstorage-auth')
  const alreadyCompleted = isCompleted('localstorage-auth')

  // Initialize user session on mount
  useEffect(() => {
    const existingSession = localStorage.getItem(STORAGE_KEY)
    if (!existingSession) {
      // Create a default "guest" user
      const defaultUser = {
        username: 'guest_user',
        role: 'guest',
        loginTime: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser))
      setCurrentUser(defaultUser)
    } else {
      try {
        setCurrentUser(JSON.parse(existingSession))
      } catch {
        // Reset if corrupted
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Poll for localStorage changes (to detect manual edits)
  useEffect(() => {
    const checkStorage = () => {
      try {
        const session = localStorage.getItem(STORAGE_KEY)
        if (session) {
          const parsed = JSON.parse(session)
          setCurrentUser(parsed)
        }
      } catch {
        // Ignore parse errors
      }
    }

    const interval = setInterval(checkStorage, 500)
    return () => clearInterval(interval)
  }, [])

  const handleAccessAdminPanel = () => {
    const session = localStorage.getItem(STORAGE_KEY)
    if (!session) {
      setAccessAttempt({ success: false, message: 'No session found!' })
      return
    }

    try {
      const user = JSON.parse(session)
      
      if (user.role === 'admin') {
        setAccessAttempt({ success: true })
        markCompleted('localstorage-auth')
      } else {
        setAccessAttempt({ 
          success: false, 
          message: `Access Denied. Your role "${user.role}" does not have admin privileges.`
        })
      }
    } catch {
      setAccessAttempt({ success: false, message: 'Invalid session data!' })
    }
  }

  const handleResetSession = () => {
    const defaultUser = {
      username: 'guest_user',
      role: 'guest',
      loginTime: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser))
    setCurrentUser(defaultUser)
    setAccessAttempt(null)
  }

  const currentStorageValue = localStorage.getItem(STORAGE_KEY) || '{}'

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'LocalStorage Auth Bypass'}</h1>
        <p className="challenge-description">{challenge?.description}</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge?.estimatedTime}</span>
          <span className="meta-item difficulty">{challenge?.difficulty}</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-scenario">
          <h2><Target size={18} /> Scenario</h2>
          <p>
            You've logged into a web application as a guest user. The developers decided 
            to store user session data in the browser's localStorage—including your role!
          </p>
          <p>
            Your mission: Gain admin access to the restricted admin panel.
          </p>
        </div>

        {/* User Session Panel */}
        <div className="session-panel">
          <div className="session-header">
            <span className="session-icon"><User size={24} /></span>
            <h3>Current Session</h3>
          </div>
          
          <div className="session-info">
            <div className="session-field">
              <span className="field-label">Username:</span>
              <span className="field-value">{currentUser?.username || 'N/A'}</span>
            </div>
            <div className="session-field">
              <span className="field-label">Role:</span>
              <span className={`field-value role-badge ${currentUser?.role}`}>
                {currentUser?.role || 'N/A'}
              </span>
            </div>
          </div>

          <div className="session-actions">
            <Button variant="primary" onClick={handleAccessAdminPanel}>
              <ShieldAlert size={16} /> Access Admin Panel
            </Button>
            <Button variant="ghost" onClick={handleResetSession}>
              <RefreshCw size={16} /> Reset Session
            </Button>
          </div>
        </div>

        {/* Storage Inspector */}
        <div className="storage-inspector">
          <h3><HardDrive size={18} /> LocalStorage Inspector</h3>
          <p className="inspector-note">
            This shows what's currently stored in your browser's localStorage:
          </p>
          <Terminal title={`localStorage["${STORAGE_KEY}"]`}>
            {JSON.stringify(JSON.parse(currentStorageValue), null, 2)}
          </Terminal>
          <p className="inspector-hint">
            <Lightbulb size={14} className="hint-icon" />
            <strong>Tip:</strong> Open your browser's DevTools (F12) → Application tab → 
            Local Storage to inspect and modify values directly!
          </p>
        </div>

        {/* Result Display */}
        {accessAttempt && (
          <div className={`result-panel ${accessAttempt.success ? 'success' : 'failure'}`}>
            {accessAttempt.success ? (
              <SuccessScreen
                challengeId="localstorage-auth"
                flag={challenge?.flag}
                explanation="You modified the localStorage session data to change your role from 'guest' to 'admin'. Since the application trusts client-side storage without server-side validation, it granted you admin access!"
              />
            ) : (
              <div className="failure-message">
                <h3><XCircle size={18} /> Access Denied</h3>
                <p>{accessAttempt.message}</p>
                <p className="hint-prompt">
                  Think about what data is stored in localStorage and how you might modify it...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hint Section */}
        <div className="hint-section">
          <button 
            className="hint-toggle"
            onClick={() => {
              if (!showHint) {
                setShowHint(true)
                if (hintIndex === 0) setHintIndex(1)
              } else {
                setShowHint(false)
              }
            }}
          >
            {showHint ? <><EyeOff size={16} /> Hide Hints</> : <><Lightbulb size={16} /> Need a Hint?</>}
          </button>
          
          {showHint && (
            <div className="hints-content">
              {hintIndex >= 1 && <p><strong>Hint 1:</strong> Look at the localStorage value shown above. What field controls access?</p>}
              {hintIndex >= 2 && <p><strong>Hint 2:</strong> Open DevTools (F12) and go to Application → Local Storage.</p>}
              {hintIndex >= 3 && <p><strong>Hint 3:</strong> Try changing the "role" value from "guest" to "admin".</p>}
              
              {hintIndex < 3 && (
                <button 
                  className="next-hint-btn"
                  onClick={() => setHintIndex(prev => prev + 1)}
                >
                  Next Hint
                </button>
              )}
              
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/localstorage-auth">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
