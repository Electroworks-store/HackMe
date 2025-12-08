import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Bug, Terminal as TerminalIcon, Code, Lightbulb, EyeOff, AlertTriangle } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './JsBackdoorChallenge.css'

// The "secret" admin credentials
const ADMIN_USER = {
  username: 'superadmin',
  accessToken: 'FLAG-JS-BACKD00R-PWNED'
}

// Challenge states for the status panel
const CHALLENGE_STATES = {
  WAITING: 'waiting',
  DEBUG_ACTIVE: 'debug_active',
  ACCESS_GRANTED: 'access_granted'
}

export default function JsBackdoorChallenge() {
  const [challengeState, setChallengeState] = useState(CHALLENGE_STATES.WAITING)
  const [statusMessages, setStatusMessages] = useState([])
  const [showHint, setShowHint] = useState(false)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('js-backdoor')
  const alreadyCompleted = isCompleted('js-backdoor')
  
  // Use refs to hold the latest state update functions so global functions can access them
  const stateRef = useRef({
    setChallengeState: null,
    setStatusMessages: null,
    markCompleted: null
  })
  
  // Keep refs updated with latest functions
  useEffect(() => {
    stateRef.current = {
      setChallengeState,
      setStatusMessages,
      markCompleted
    }
  })

  // Helper to add message using the ref (avoids stale closure)
  const addMessage = useCallback((msg, type = 'info') => {
    const entry = { msg, type, time: new Date().toLocaleTimeString() }
    if (stateRef.current.setStatusMessages) {
      stateRef.current.setStatusMessages(prev => [...prev, entry])
    }
  }, [])

  // Set up the backdoor functions on window
  useEffect(() => {
    // appInfo() - "accidentally" reveals the password
    window.appInfo = function() {
      console.log('%c📦 HackMe Lab v1.0.0 - Debug build', 'color: #00ff88; font-weight: bold;')
      console.log('%cDebug password: letmein', 'color: #888;')
      addMessage('📦 HackMe Lab v1.0.0 - Debug build', 'info')
      addMessage('Debug password: letmein', 'warning')
      return 'HackMe Lab v1.0.0'
    }

    // debugMode() - activates debug mode with correct password
    window.debugMode = function(password) {
      if (password === 'letmein') {
        console.log('%c🔓 Debug mode activated!', 'color: #00ff88; font-weight: bold;')
        console.log('%cAdmin credentials exposed:', 'color: #888;')
        console.log(`%c  Username: ${ADMIN_USER.username}`, 'color: #00aaff;')
        console.log(`%c  Token: ${ADMIN_USER.accessToken}`, 'color: #00aaff;')
        console.log('%cRun grantAccess() to complete the challenge!', 'color: #ffaa00;')
        
        addMessage('🔓 Debug mode activated!', 'success')
        addMessage(`Admin: ${ADMIN_USER.username}`, 'success')
        addMessage('Run grantAccess() to unlock!', 'info')
        
        stateRef.current.setChallengeState(CHALLENGE_STATES.DEBUG_ACTIVE)
        
        // Expose the grantAccess function
        window.grantAccess = function() {
          console.log('%c🎉 ACCESS GRANTED!', 'color: #00ff88; font-size: 16px; font-weight: bold;')
          console.log('%cChallenge complete! Check the page for your flag.', 'color: #888;')
          
          addMessage('🎉 ACCESS GRANTED!', 'success')
          addMessage('Challenge complete!', 'success')
          
          stateRef.current.setChallengeState(CHALLENGE_STATES.ACCESS_GRANTED)
          stateRef.current.markCompleted('js-backdoor')
          
          return '🏴 Flag unlocked! Check the page.'
        }
        
        return 'Debug mode active. grantAccess() is now available.'
      } else if (password === undefined) {
        console.log('%cUsage: debugMode("password")', 'color: #ffaa00;')
        console.log('%cHint: Try running appInfo() first...', 'color: #888;')
        addMessage('Usage: debugMode("password")', 'warning')
        return 'Missing password argument'
      } else {
        console.log('%c❌ Invalid debug password!', 'color: #ff4444;')
        addMessage('❌ Invalid password!', 'error')
        return 'Invalid password'
      }
    }

    // Log helpful message to the real console
    console.log('')
    console.log('%c🔍 JS Backdoor Challenge', 'color: #00ff88; font-size: 16px; font-weight: bold;')
    console.log('%c─────────────────────────', 'color: #333;')
    console.log('%cLook at the source code on this page...', 'color: #888;')
    console.log('%cTry running appInfo() or debugMode() in this console!', 'color: #888;')
    console.log('')

    // Cleanup on unmount - only clean up if component is truly unmounting
    // Don't delete functions aggressively since StrictMode causes double-mount
    return () => {
      // Small delay to allow any pending calls to complete
      setTimeout(() => {
        // Only delete if the page has actually changed
        if (!document.querySelector('.js-backdoor-challenge')) {
          delete window.debugMode
          delete window.grantAccess
          delete window.appInfo
        }
      }, 100)
    }
  }, [addMessage]) // Include addMessage in deps

  const handleReset = () => {
    setStatusMessages([])
    setChallengeState(CHALLENGE_STATES.WAITING)
    delete window.grantAccess
  }

  // Derived state
  const accessGranted = challengeState === CHALLENGE_STATES.ACCESS_GRANTED
  const debugActive = challengeState === CHALLENGE_STATES.DEBUG_ACTIVE || accessGranted

  // Fake "minified" source code that reveals the backdoor
  const sourceCodeSnippet = `// app.bundle.js (minified)
!function(e,t){"use strict";
  // Debug backdoor - TODO: remove before production!
  window.debugMode=function(p){
    if(p==="letmein"){
      console.log("Debug activated");
      window.grantAccess=function(){/*...*/}
    }
  };
  window.appInfo=function(){
    console.log("HackMe Lab v1.0.0 - Debug build");
  };
// ... rest of minified code ...
}();`

  return (
    <div className="challenge-container js-backdoor-challenge">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'JavaScript Backdoor'}</h1>
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
            You're testing a web application and discovered that the developers left some 
            debug functions in the production JavaScript code. These functions were meant 
            for development but were never removed!
          </p>
          <p>
            Your mission: Find and exploit the debug backdoor to gain admin access.
          </p>
        </div>

        {/* Source Code Preview */}
        <div className="source-panel">
          <div className="source-header">
            <span className="source-icon"><Code size={24} /></span>
            <h3>Suspicious Source Code</h3>
            <span className="source-badge"><AlertTriangle size={14} /> Found in DevTools</span>
          </div>
          
          <p className="source-note">
            While inspecting the page source, you found this interesting snippet:
          </p>
          
          <Terminal title="app.bundle.js">
            {sourceCodeSnippet}
          </Terminal>
        </div>

        {/* Console Output Viewer */}
        <div className="console-panel">
          <h3><TerminalIcon size={18} /> Challenge Progress</h3>
          <p className="console-note">
            <strong>Use your browser's real DevTools console (F12)</strong> to run the debug functions.
            When you run the commands, your progress will appear below:
          </p>
          
          {/* Status indicator */}
          <div className={`status-indicator ${challengeState}`}>
            {challengeState === CHALLENGE_STATES.WAITING && (
              <span>⏳ Waiting... Try running <code>appInfo()</code> in DevTools</span>
            )}
            {challengeState === CHALLENGE_STATES.DEBUG_ACTIVE && (
              <span>🔓 Debug mode active! Now run <code>grantAccess()</code> in DevTools</span>
            )}
            {challengeState === CHALLENGE_STATES.ACCESS_GRANTED && (
              <span>🎉 Access granted! Challenge complete!</span>
            )}
          </div>
          
          <div className="console-output">
            {statusMessages.length === 0 ? (
              <div className="console-empty">
                <span className="console-prompt">&gt;</span>
                <span className="console-placeholder">
                  Press F12 → Console tab → Type <code>appInfo()</code> and press Enter
                </span>
              </div>
            ) : (
              <>
                <div className="console-header">
                  <span className="console-label">📤 Output from your commands:</span>
                </div>
                {statusMessages.map((entry, index) => (
                  <div key={index} className={`console-entry ${entry.type}`}>
                    <span className="console-time">[{entry.time}]</span>
                    <span className="console-msg">{entry.msg}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="console-actions">
            <Button variant="ghost" onClick={handleReset}>
              Reset Challenge
            </Button>
          </div>
        </div>

        {/* Protected Area */}
        <div className={`protected-panel ${accessGranted ? 'unlocked' : 'locked'}`}>
          <div className="protected-header">
            <span className="protected-icon">
              <Bug size={24} />
            </span>
            <h3>Admin Control Panel</h3>
            <span className={`status-badge ${accessGranted ? 'unlocked' : 'locked'}`}>
              {accessGranted ? '🔓 Unlocked' : '🔒 Locked'}
            </span>
          </div>
          
          {!accessGranted ? (
            <div className="protected-message">
              <p>This area is restricted to administrators only.</p>
              <p className="protected-hint">
                Maybe there's a way to bypass this check using the debug functions?
              </p>
            </div>
          ) : (
            <SuccessScreen
              challengeId="js-backdoor"
              flag={challenge?.flag}
              explanation="The developers left debug functions (debugMode(), appInfo()) in the production code. You found the hardcoded password in the source code and used it to activate the backdoor. This is why you should always remove debug code and never hardcode passwords!"
            />
          )}
        </div>

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
              <p><strong>Hint 1:</strong> Look at the source code snippet. What functions are available?</p>
              <p><strong>Hint 2:</strong> Try running <code>appInfo()</code> in your browser console (F12).</p>
              <p><strong>Hint 3:</strong> The password is visible in the code: "letmein". Try <code>debugMode("letmein")</code></p>
              <p><strong>Hint 4:</strong> After activating debug mode, run <code>grantAccess()</code></p>
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/js-backdoor">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
