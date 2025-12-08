import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, FileText, Search, Lock, Crown, User, Ban, EyeOff, Lightbulb } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import { getRole, initializeRoleCookie, isAdmin, resetRole } from '../../utils/cookieUtils'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './CookieChallenge.css'

export default function CookieChallenge() {
  const [showHint, setShowHint] = useState(false)
  const [currentRole, setCurrentRole] = useState('user')
  const [justCompleted, setJustCompleted] = useState(false)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('robots-cookie')
  const alreadyCompleted = isCompleted('robots-cookie')

  // Reset cookie when entering the challenge (fresh start each time)
  useEffect(() => {
    resetRole()
    setCurrentRole('user')
    setJustCompleted(false)
  }, [])

  // Poll for cookie changes (since we can't detect manual changes)
  useEffect(() => {
    const interval = setInterval(() => {
      const role = getRole()
      setCurrentRole(role)
      
      if (role.toLowerCase() === 'admin' && !alreadyCompleted && !justCompleted) {
        markCompleted('robots-cookie')
        setJustCompleted(true)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [alreadyCompleted, markCompleted, justCompleted])

  const isAdminRole = currentRole.toLowerCase() === 'admin'

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge.title}</h1>
        <p className="challenge-description">{challenge.description}</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge.estimatedTime}</span>
          <span className="meta-item difficulty">{challenge.difficulty}</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-scenario">
          <h2><Target size={18} /> Scenario</h2>
          <p>
            You've heard rumors that HackMe Lab has some secret admin pages. 
            Experienced hackers know that <code>/robots.txt</code> often reveals 
            interesting information...
          </p>
          <p>
            Once you find the hints, figure out how to gain admin access to this page!
          </p>
        </div>

        {/* Step 1: robots.txt hint */}
        <div className="step-card">
          <div className="step-number">Step 1</div>
          <h3>Find the Hidden Path</h3>
          <p>
            Many websites have a <code>robots.txt</code> file that tells search engines 
            what not to index. But it's publicly accessible...
          </p>
          <div className="step-action">
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-btn"
            >
              <FileText size={16} /> View /robots.txt
            </a>
          </div>
        </div>

        {/* Step 2: Visit secret page */}
        <div className="step-card">
          <div className="step-number">Step 2</div>
          <h3>Visit the Secret Page</h3>
          <p>
            Did you find something interesting in robots.txt? Visit the disallowed path 
            to get more hints.
          </p>
          <div className="step-action">
            <Link to="/super-secret-admin-hints" className="link-btn">
              <Search size={16} /> Investigate the secret path
            </Link>
          </div>
        </div>

        {/* Current Status */}
        <div className="status-panel">
          <h3><Lock size={18} /> Access Check</h3>
          
          <div className="cookie-display">
            <span className="cookie-label">Current Cookie:</span>
            <code className="cookie-value">hacklab_role={currentRole}</code>
          </div>

          <div className={`access-status ${isAdminRole ? 'admin' : 'user'}`}>
            <span className="status-icon">{isAdminRole ? <Crown size={20} /> : <User size={20} />}</span>
            <span className="status-text">
              Access Level: <strong>{currentRole.toUpperCase()}</strong>
            </span>
          </div>

          {!isAdminRole && (
            <div className="access-denied">
              <p><Ban size={14} /> Admin content is hidden from regular users.</p>
              <p className="subtle-hint">
                Your browser might already know who you are... check your cookies.
              </p>
            </div>
          )}
        </div>

        {/* Success State */}
        {isAdminRole && (
          <div className="admin-success">
            <SuccessScreen
              challengeId="robots-cookie"
              flag={challenge.flag}
              explanation="You discovered two common vulnerabilities: Information Disclosure via robots.txt (the file revealed a hidden path with sensitive hints) and Client-Side Authorization (the application stored the user's role in a cookie that could be modified). In real applications, authorization should always be verified on the server!"
            />
          </div>
        )}

        {/* Hint Section */}
        <div className="hint-section">
          <button 
            className="hint-toggle"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? <><EyeOff size={16} /> Hide Hints</> : <><Lightbulb size={16} /> Need a Hint?</>}
          </button>
          
          {showHint && (
            <div className="hints-content">
              <p><strong>Hint 1:</strong> First, check <code>/robots.txt</code> in your browser.</p>
              <p><strong>Hint 2:</strong> Visit the path mentioned in robots.txt for more clues.</p>
              <p><strong>Hint 3:</strong> Open your browser's DevTools (F12) → Application tab → Cookies.</p>
              <p><strong>Hint 4:</strong> Find the <code>hacklab_role</code> cookie and change its value to <code>admin</code>.</p>
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/robots-cookie">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
