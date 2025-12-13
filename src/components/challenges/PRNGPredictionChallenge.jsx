import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, Terminal, AlertTriangle, Lock, Unlock, Cpu, Binary, Zap, XCircle } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './PRNGPredictionChallenge.css'

// ============================================
// PRNG CONFIGURATION - Linear Congruential Generator
// Formula: next = (a * current + c) % m
// This is intentionally weak and predictable
// ============================================

const LCG_CONFIG = {
  a: 1103515245,  // multiplier
  c: 12345,       // increment  
  m: 2147483648,  // modulus (2^31)
}

// Seed based on a predictable value (session timestamp truncated)
// In real code this would be Date.now() but we simulate with a fixed offset
const SESSION_SEED = 1702387200000 // Fixed timestamp for reproducibility

// Generate the seed from session
function generateSeed() {
  // The "weakness": seed is derived from timestamp % 100000
  return SESSION_SEED % 100000
}

// LCG PRNG class - this is what users need to reverse-engineer
class WeakPRNG {
  constructor(seed) {
    this.state = seed
  }
  
  next() {
    this.state = (LCG_CONFIG.a * this.state + LCG_CONFIG.c) % LCG_CONFIG.m
    // Return a 6-digit token
    return String(Math.abs(this.state) % 1000000).padStart(6, '0')
  }
  
  // Get current internal state (for verification)
  getState() {
    return this.state
  }
}

// Pre-generate tokens for the challenge
const INITIAL_SEED = generateSeed()
const prng = new WeakPRNG(INITIAL_SEED)
const DISPLAYED_TOKENS = [prng.next(), prng.next(), prng.next()]
const CORRECT_NEXT_TOKEN = prng.next()

// The "secure" token generator code visible to user (minified style)
const VISIBLE_CODE = `// CIB Token Generator v2.1 - "Secure" Random Tokens
// DO NOT MODIFY - Security team approved

var _0x7f2a=['state','next'];(function(_0x2d8f05,_0x4a7c21){
  var _0x58f3d7=function(_0x32a1b5){
    while(--_0x32a1b5){_0x2d8f05['push'](_0x2d8f05['shift']());}
  };_0x58f3d7(++_0x4a7c21);
}(_0x7f2a,0x1f4));

// Token generation internals
function _generateToken() {
  // Initialization from session
  var seed = Date.now() % 100000;
  
  // Core algorithm - industry standard!
  var a = 1103515245;
  var c = 12345;
  var m = 2147483648;
  
  this._s = seed;
  this.next = function() {
    this._s = (a * this._s + c) % m;
    return String(Math.abs(this._s) % 1000000).padStart(6, '0');
  };
}

// Public API
window.CIBTokenGen = new _generateToken();
console.log("[CIB] Token generator initialized. Seed:", Date.now() % 100000);`

const FLAG = 'FLAG{prng_pr3d1ct4bl3_r4nd0mn3ss}'

export default function PRNGPredictionChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [prediction, setPrediction] = useState('')
  const [hasAttempted, setHasAttempted] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [error, setError] = useState('')
  const [tokenHistory, setTokenHistory] = useState(DISPLAYED_TOKENS)
  
  const challenge = getChallengeById('prng-prediction')
  const alreadyCompleted = isCompleted('prng-prediction')
  
  const hints = [
    'The token generator uses a predictable seed. Check the console for initialization messages.',
    'The algorithm is a Linear Congruential Generator (LCG). Look for the formula: next = (a * state + c) % m',
    'The seed is derived from Date.now() % 100000. If you know when the session started, you can calculate it.',
    'With the displayed tokens, you can work backwards to find the current state, then predict the next one.',
    'LCG formula: state = (1103515245 * state + 12345) % 2147483648. Token = state % 1000000, padded to 6 digits.',
    'Try implementing the LCG in your console. Feed it the known tokens to verify your state, then call next().',
  ]

  // Check for locked state on mount
  useEffect(() => {
    const locked = localStorage.getItem('cib_prng_locked') === 'true'
    setIsLocked(locked)
    setHasAttempted(locked)
    
    // Expose the "minified" code to console
    console.log('%c[CIB Security] Token Generator Code:', 'color: #00ff88; font-weight: bold')
    console.log(VISIBLE_CODE)
    console.log('%c[CIB] Previous tokens issued:', 'color: #00ff88')
    DISPLAYED_TOKENS.forEach((t, i) => console.log(`  Token ${i + 1}: ${t}`))
    console.log('%c[CIB] Predict the next token to gain access.', 'color: #ffa500')
    
    // Expose helper for users who figure it out
    window.CIB_LCG = {
      a: LCG_CONFIG.a,
      c: LCG_CONFIG.c,
      m: LCG_CONFIG.m,
      hint: 'Formula: next_state = (a * state + c) % m'
    }
  }, [])
  
  const handlePrediction = () => {
    if (isLocked || hasAttempted) return
    
    setHasAttempted(true)
    
    const trimmedPrediction = prediction.trim().padStart(6, '0')
    
    if (trimmedPrediction === CORRECT_NEXT_TOKEN) {
      // Correct prediction!
      markCompleted('prng-prediction')
      setShowSuccess(true)
    } else {
      // Wrong prediction - lock the challenge
      setIsLocked(true)
      setError(`Incorrect prediction. Expected: ${CORRECT_NEXT_TOKEN}. The system detected your failed attempt.`)
      localStorage.setItem('cib_prng_locked', 'true')
    }
  }
  
  const handleReset = () => {
    localStorage.removeItem('cib_prng_locked')
    setIsLocked(false)
    setHasAttempted(false)
    setPrediction('')
    setError('')
    setHintIndex(0)
    setShowHint(false)
  }
  
  const nextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(prev => prev + 1)
    }
  }

  if (showSuccess) {
    return (
      <SuccessScreen
        flag={FLAG}
        challengeId="prng-prediction"
        title="PRNG Broken!"
        description="You successfully predicted the 'random' token by reverse-engineering the weak PRNG."
        learningPoints={[
          "Math.random() and simple LCGs are NOT cryptographically secure",
          "Predictable seeds (like timestamps) make PRNGs trivially breakable",
          "Use crypto.getRandomValues() or similar CSPRNGs for security-critical randomness",
          "Never trust client-side randomness for authentication tokens"
        ]}
      />
    )
  }

  return (
    <div className="challenge-container prng-challenge">
      <Link to="/challenges" className="back-link">
        <ArrowLeft size={20} />
        Back to Challenges
      </Link>

      <div className="challenge-header">
        <div className="challenge-title-row">
          <h1>
            <Cpu size={32} />
            Predict the Unpredictable
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
          <span className="category">Cryptography</span>
          <span className="time"><Clock size={14} /> 30-45 min</span>
        </div>
      </div>

      <div className="mission-brief">
        <div className="brief-header">
          <Target size={20} />
          <h2>Mission Briefing</h2>
        </div>
        <div className="brief-content">
          <p>
            <strong>Confidential Information Bureau (CIB)</strong> uses "secure random tokens" 
            to protect access to sensitive internal systems.
          </p>
          <p>
            Intelligence suggests their token generator is flawed. Your mission: prove the 
            randomness is fake by <strong>predicting the next valid token</strong>.
          </p>
          <div className="warning-box">
            <AlertTriangle size={18} />
            <span>WARNING: You have only ONE attempt. A failed prediction will trigger lockout.</span>
          </div>
        </div>
      </div>

      <div className="token-panel">
        <div className="panel-header">
          <Terminal size={18} />
          <span>CIB Token History</span>
          <span className="status-badge">
            {isLocked ? (
              <><Lock size={14} /> LOCKED</>
            ) : (
              <><Unlock size={14} /> ACTIVE</>
            )}
          </span>
        </div>
        <div className="panel-content">
          <p className="panel-info">Previously issued tokens:</p>
          <div className="token-list">
            {tokenHistory.map((token, index) => (
              <div key={index} className="token-item">
                <span className="token-label">Token {index + 1}:</span>
                <code className="token-value">{token}</code>
              </div>
            ))}
          </div>
          
          <div className="prediction-section">
            <label htmlFor="prediction">Enter your prediction for Token 4:</label>
            <div className="prediction-input-group">
              <input
                id="prediction"
                type="text"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                disabled={isLocked || hasAttempted}
                className={isLocked ? 'locked' : ''}
              />
              <Button
                onClick={handlePrediction}
                disabled={isLocked || hasAttempted || prediction.length < 1}
                variant="primary"
              >
                <Zap size={16} />
                Submit Prediction
              </Button>
            </div>
            
            {error && (
              <div className="error-message">
                <XCircle size={16} />
                {error}
              </div>
            )}
            
            {isLocked && (
              <div className="locked-notice">
                <Lock size={18} />
                <div>
                  <strong>System Locked</strong>
                  <p>Failed prediction detected. In a real system, this attempt would be logged.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="investigation-panel">
        <div className="panel-header">
          <Binary size={18} />
          <span>Investigation Console</span>
        </div>
        <div className="panel-content">
          <p>Open your browser's DevTools (F12) and check the Console tab for exposed code and hints.</p>
          <p className="code-hint">
            Look for: <code>window.CIB_LCG</code> and the token generator initialization.
          </p>
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

      {(isLocked || alreadyCompleted) && (
        <div className="reset-section">
          <Button variant="ghost" onClick={handleReset}>
            <RefreshCw size={16} />
            Reset Challenge
          </Button>
        </div>
      )}
    </div>
  )
}
