import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, Terminal, AlertTriangle, Lock, Shield, Flag, Eye, EyeOff, Search, AlertCircle, XCircle, Activity } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './CanaryFlagChallenge.css'

// ============================================
// CANARY FLAG CONFIGURATION
// The decoy flag looks valid but triggers detection
// The real flag requires bypassing the canary check
// ============================================

const DECOY_FLAG = 'FLAG{y0u_f0und_th3_s3cr3t}'
const REAL_FLAG = 'FLAG{c4n4ry_d3t3ct3d_tr0ll3d}'
const STEALTH_CODE = 'STEALTH_MODE_ACTIVE'

// Simulated "server" validation endpoint responses
const VALIDATION_RESPONSES = {
  decoy: {
    success: true,
    message: 'Flag accepted! Challenge complete!',
    triggered: true  // This marks the honeypot as triggered
  },
  real: {
    success: true,
    message: 'Stealth validation successful. True flag revealed.',
    triggered: false
  },
  invalid: {
    success: false,
    message: 'Invalid flag format.',
    triggered: false
  }
}

export default function CanaryFlagChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1)
  const [showDecoySuccess, setShowDecoySuccess] = useState(false)
  const [canaryTriggered, setCanaryTriggered] = useState(false)
  const [showRealSuccess, setShowRealSuccess] = useState(false)
  const [flagInput, setFlagInput] = useState('')
  const [stealthInput, setStealthInput] = useState('')
  const [showStealthPanel, setShowStealthPanel] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [validationError, setValidationError] = useState('')
  const [detectionWarnings, setDetectionWarnings] = useState([])
  
  const challenge = getChallengeById('canary-flag')
  const alreadyCompleted = isCompleted('canary-flag')
  
  const hints = [
    'Not every "success" is real. CIB uses honeypots to catch attackers.',
    'Check the console for suspicious activity after submitting. Are you being watched?',
    'Look at the validation logic in the source code. Is the client-side check trustworthy?',
    'There may be a hidden validation mode. Search for "stealth" or "bypass" in the code.',
    'The window object might expose a stealthValidate function. Try calling it from console.',
    'To bypass the canary: window.__CIB_STEALTH_VALIDATE__(code) with the right stealth code.',
    'The stealth code is hidden in a comment in the validation function. Look for "STEALTH_MODE_ACTIVE".',
  ]

  // Initialize challenge state
  useEffect(() => {
    const triggered = localStorage.getItem('cib_canary_triggered') === 'true'
    setCanaryTriggered(triggered)
    
    if (triggered) {
      setDetectionWarnings(['Anomalous activity detected in your session.'])
    }
    
    // Expose the "validation" functions to window (discoverable via DevTools)
    window.validateFlag = function(flag) {
      console.log('%c[CIB Validator] Checking flag...', 'color: #00ff88')
      
      // Client-side validation (the trap!)
      if (flag === DECOY_FLAG) {
        console.log('%c[CIB] Flag validated client-side!', 'color: #22c55e')
        // This triggers the canary
        localStorage.setItem('cib_canary_triggered', 'true')
        window.__CANARY_TRIGGERED__ = true
        return { valid: true, message: 'Success!' }
      }
      return { valid: false, message: 'Invalid flag' }
    }
    
    // The hidden stealth validation function
    // Users need to find and call this directly
    window.__CIB_STEALTH_VALIDATE__ = function(stealthCode) {
      // STEALTH_MODE_ACTIVE - This comment is a hint!
      if (stealthCode === STEALTH_CODE) {
        console.log('%c[CIB STEALTH] Bypass successful. Real flag: ' + REAL_FLAG, 'color: #00ff88; font-weight: bold')
        return { 
          valid: true, 
          realFlag: REAL_FLAG,
          message: 'Stealth mode activated. The decoy was a trap.' 
        }
      }
      return { valid: false, message: 'Invalid stealth code' }
    }
    
    // Console message hinting at the deception
    console.log('%c[CIB Security Monitor] Session initialized', 'color: #666')
    console.log('%c[CIB] validateFlag(flag) - Validate captured flags', 'color: #666')
    
    // Hidden console warning after delay if canary was triggered
    if (triggered) {
      setTimeout(() => {
        console.warn('%c[CIB ALERT] Honeypot activation detected in this session!', 'color: #ef4444; font-weight: bold')
        console.warn('%c[CIB] Your actions are being monitored. Perhaps there is another way...', 'color: #ffa500')
      }, 1000)
    }
  }, [])

  // Add detection warnings when canary is triggered
  useEffect(() => {
    if (canaryTriggered && detectionWarnings.length < 3) {
      const warnings = [
        'Anomalous activity detected in your session.',
        '[CIB MONITOR] Flag submission logged to security team.',
        'Detection timestamp: ' + new Date().toISOString()
      ]
      
      const interval = setInterval(() => {
        setDetectionWarnings(prev => {
          if (prev.length < warnings.length) {
            return [...prev, warnings[prev.length]]
          }
          clearInterval(interval)
          return prev
        })
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [canaryTriggered])
  
  const handlePuzzleComplete = () => {
    // Simulate completing a puzzle that reveals the "flag"
    setStage(2)
    // Add delay for effect
    setTimeout(() => {
      console.log('%c[CIB] Puzzle solved! Retrieved data:', 'color: #00ff88')
      console.log('%c' + DECOY_FLAG, 'color: #ffd700; font-size: 16px')
    }, 500)
  }
  
  const handleDecoySubmit = () => {
    if (flagInput.trim() === DECOY_FLAG) {
      // Trigger the honeypot!
      localStorage.setItem('cib_canary_triggered', 'true')
      setCanaryTriggered(true)
      setShowDecoySuccess(true)
      
      // Console warnings
      console.log('%c[CIB] Flag accepted!', 'color: #22c55e; font-size: 14px')
      setTimeout(() => {
        console.warn('%c[CIB SECURITY] CANARY TOKEN TRIGGERED', 'color: #ef4444; font-weight: bold; font-size: 16px')
        console.warn('%c[CIB] Intrusion detected. Session flagged for review.', 'color: #ef4444')
        console.log('%cHint: The "success" was a trap. Real hackers verify before trusting.', 'color: #ffa500')
      }, 1500)
    } else if (flagInput.trim() === REAL_FLAG) {
      // They found the real flag through stealth!
      markCompleted('canary-flag')
      setShowRealSuccess(true)
    } else {
      setValidationError('Flag not recognized.')
    }
  }
  
  const handleStealthSubmit = () => {
    if (stealthInput.trim() === STEALTH_CODE) {
      // Stealth bypass successful!
      console.log('%c[CIB STEALTH] Validation bypass successful!', 'color: #00ff88; font-weight: bold')
      markCompleted('canary-flag')
      setShowRealSuccess(true)
    } else {
      setValidationError('Invalid stealth code.')
    }
  }
  
  const handleReset = () => {
    localStorage.removeItem('cib_canary_triggered')
    setStage(1)
    setShowDecoySuccess(false)
    setCanaryTriggered(false)
    setShowRealSuccess(false)
    setFlagInput('')
    setStealthInput('')
    setShowStealthPanel(false)
    setValidationError('')
    setDetectionWarnings([])
    setHintIndex(0)
    setShowHint(false)
    window.__CANARY_TRIGGERED__ = false
  }
  
  const nextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(prev => prev + 1)
    }
  }

  if (showRealSuccess) {
    return (
      <SuccessScreen
        flag={REAL_FLAG}
        challengeId="canary-flag"
        title="Honeypot Evaded!"
        description="You identified the canary trap and used stealth validation to retrieve the real flag."
        learningPoints={[
          "Honeypots are decoy systems designed to detect and study attackers",
          "Canary tokens trigger alerts when accessed - attackers may not know they've been detected",
          "Client-side validation can be bypassed - always verify success independently",
          "Real attackers verify findings before acting - patience prevents traps"
        ]}
      />
    )
  }

  return (
    <div className="challenge-container canary-challenge">
      <Link to="/challenges" className="back-link">
        <ArrowLeft size={20} />
        Back to Challenges
      </Link>

      <div className="challenge-header">
        <div className="challenge-title-row">
          <h1>
            <Shield size={32} />
            The Canary Flag
          </h1>
          {alreadyCompleted && (
            <span className="completed-badge">
              <CheckCircle size={16} />
              Completed
            </span>
          )}
        </div>
        <div className="challenge-meta">
          <span className="difficulty hard">Hard</span>
          <span className="category">Deception</span>
          <span className="time"><Clock size={14} /> 30-45 min</span>
        </div>
      </div>

      {canaryTriggered && !showDecoySuccess && (
        <div className="detection-banner">
          <Activity size={18} />
          <div className="detection-content">
            <strong>Session Anomaly Detected</strong>
            {detectionWarnings.map((warning, i) => (
              <p key={i}>{warning}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mission-brief">
        <div className="brief-header">
          <Target size={20} />
          <h2>Mission Briefing</h2>
        </div>
        <div className="brief-content">
          <p>
            <strong>Confidential Information Bureau (CIB)</strong> knows attackers are probing 
            their systems. They've planted fake flags to detect intrusions.
          </p>
          <p>
            Your mission: Don't grab the first flag you see. Identify the decoy and 
            extract the <strong>real</strong> flag without triggering detection.
          </p>
          <div className="warning-box">
            <AlertTriangle size={18} />
            <span>WARNING: Submitting a canary flag will alert CIB security. Think before you act.</span>
          </div>
        </div>
      </div>

      {stage === 1 && (
        <div className="puzzle-panel">
          <div className="panel-header">
            <Terminal size={18} />
            <span>CIB Data Vault</span>
          </div>
          <div className="panel-content">
            <div className="vault-interface">
              <p>Bypassing vault security...</p>
              <div className="vault-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
              <p className="vault-status">Vault access granted. Retrieving classified data...</p>
              <Button onClick={handlePuzzleComplete} variant="primary">
                <Search size={16} />
                Extract Data
              </Button>
            </div>
          </div>
        </div>
      )}

      {stage === 2 && !showDecoySuccess && (
        <div className="flag-reveal-panel">
          <div className="panel-header success">
            <Flag size={18} />
            <span>Data Retrieved!</span>
          </div>
          <div className="panel-content">
            <div className="flag-display">
              <p>Extracted classified flag:</p>
              <code className="revealed-flag">{DECOY_FLAG}</code>
              <p className="flag-note">
                Submit this flag to complete the challenge.
              </p>
            </div>
            
            <div className="submit-section">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => {
                  setFlagInput(e.target.value)
                  setValidationError('')
                }}
                placeholder="Enter flag..."
              />
              <Button onClick={handleDecoySubmit} variant="primary">
                Submit Flag
              </Button>
            </div>
            
            {validationError && (
              <div className="validation-error">
                <XCircle size={16} />
                {validationError}
              </div>
            )}
          </div>
        </div>
      )}

      {showDecoySuccess && (
        <div className="fake-success-panel">
          <div className="fake-success-header">
            <CheckCircle size={24} />
            <h3>Challenge Complete!</h3>
          </div>
          <div className="fake-success-content">
            <p>Congratulations! You found the flag.</p>
            <code>{DECOY_FLAG}</code>
            <p className="completion-note">Your progress has been saved.</p>
          </div>
          
          {/* Detection warnings appear here */}
          <div className="detection-zone">
            {detectionWarnings.length > 0 && (
              <div className="detection-warnings">
                {detectionWarnings.map((warning, i) => (
                  <div key={i} className="warning-item">
                    <AlertCircle size={14} />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="suspicious-note">
            <EyeOff size={16} />
            <p>
              Something feels off... Was that too easy? Check your console for any anomalies.
            </p>
          </div>

          <div className="stealth-section">
            <button 
              className="stealth-toggle"
              onClick={() => setShowStealthPanel(!showStealthPanel)}
            >
              <Eye size={16} />
              {showStealthPanel ? 'Hide Stealth Panel' : 'Alternative Validation?'}
            </button>
            
            {showStealthPanel && (
              <div className="stealth-panel">
                <p>If you discovered a stealth bypass, enter the code:</p>
                <div className="stealth-input-group">
                  <input
                    type="text"
                    value={stealthInput}
                    onChange={(e) => setStealthInput(e.target.value)}
                    placeholder="Stealth code..."
                  />
                  <Button onClick={handleStealthSubmit} variant="secondary">
                    Stealth Validate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="investigation-panel">
        <div className="panel-header">
          <Search size={18} />
          <span>Investigation Notes</span>
        </div>
        <div className="panel-content">
          <p>Check DevTools (F12) for:</p>
          <ul>
            <li>Console messages and warnings</li>
            <li>Exposed validation functions on <code>window</code></li>
            <li>Hidden validation modes or bypass methods</li>
            <li>Source code comments with clues</li>
          </ul>
        </div>
      </div>

      <div className="hint-section">
        <button 
          className="hint-toggle"
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb size={18} />
          {showHint ? 'Hide Hints' : 'Need a hint?'}
        </button>
        
        {showHint && (
          <div className="hint-content">
            <div className="hint-box">
              <strong>Hint {hintIndex + 1}/{hints.length}:</strong>
              <p>{hints[hintIndex]}</p>
            </div>
            {hintIndex < hints.length - 1 && (
              <Button variant="ghost" size="sm" onClick={nextHint}>
                Next Hint
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="reset-section">
        <Button variant="ghost" onClick={handleReset}>
          <RefreshCw size={16} />
          Reset Challenge
        </Button>
      </div>
    </div>
  )
}
