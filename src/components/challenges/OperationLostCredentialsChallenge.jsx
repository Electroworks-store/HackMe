import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, StickyNote, FileCode, AlertTriangle, Play, ChevronRight, Lock, Unlock, User, Calendar, Key, Terminal, Shield, XCircle } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import StageProgress from '../ui/StageProgress'
import './OperationLostCredentialsChallenge.css'

// ============================================
// PASSWORD CONFIGURATION
// Scheme: {pet}{month}{digits} in any order
// Correct: loki0352 (or permutations)
// ============================================

const CORRECT_PASSWORD = 'loki0352'
const ALTERNATE_PASSWORDS = [
  'loki0352',
  '03loki52',
  'loki5203',
  '52loki03',
  '0352loki',
  '5203loki'
]

const MAX_ATTEMPTS = 3
const FLAG = 'FLAG{cib_opsec_failure_exposed}'

// Clue data for the desk items
const DESK_ITEMS = {
  stickyNote: {
    title: 'Sticky Note',
    icon: StickyNote,
    content: `Password scheme reminder:
{favorite pet}{birth month}{random 2 digits}

"I keep forgetting the order..."`,
    hint: 'The scheme has three parts but the order is not fixed.'
  },
  configSnippet: {
    title: 'Developer Preferences',
    icon: FileCode,
    content: `const devPrefs = {
  petNames: ["neo", "sparky", "loki"],
  theme: "dark",
  hint: "never remembered passwords in order"
};`,
    hint: 'Three possible pet names. One of them is the correct one.'
  },
  calendarNote: {
    title: 'Calendar Entry',
    icon: Calendar,
    content: `March 15 - Birthday party!
"Can not believe the fireworks show 
is on my birthday again this March."

Note: Order cake by March 10`,
    hint: 'Birth month appears to be March (03).'
  },
  crashLog: {
    title: 'Crash Log',
    icon: Terminal,
    content: `[ERROR] 2024-10-12 14:32:17
Application crashed unexpectedly.
Error code: ERR-52-LOGIN-FF
Stack trace: 
  at LoginModule.validate()
  at AuthService.attempt(52)
  
"Attempt 52 failed due to invalid nonce."`,
    hint: 'The number 52 appears in the error code and attempt log.'
  }
}

export default function OperationLostCredentialsChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [sandboxCode, setSandboxCode] = useState('')
  const [sandboxOutput, setSandboxOutput] = useState('')
  const [sandboxError, setSandboxError] = useState('')
  const [generatedPasswords, setGeneratedPasswords] = useState([])
  const [loginUsername, setLoginUsername] = useState('jharris')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [loginLocked, setLoginLocked] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [bypassUsed, setBypassUsed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const stateRef = useRef({ setLoginLocked })
  
  const challenge = getChallengeById('operation-lost-credentials')
  const alreadyCompleted = isCompleted('operation-lost-credentials')
  
  const hints = [
    'Examine all the desk items carefully. Each one contains a piece of the password.',
    'The sticky note reveals the password scheme: pet + birth month + 2 digits.',
    'The developer preferences file lists three possible pet names: neo, sparky, loki.',
    'The calendar note mentions "birthday again this March" - so birth month is 03.',
    'The crash log has "ERR-52" and "Attempt 52" - the 2-digit number is 52.',
    'The order is not fixed. Try different permutations like loki0352 or 03loki52.',
    'After getting locked out, check the page source or console for a developer bypass.',
    'Look for window.cibDevBypass in the console - it resets the lockout.',
  ]
  
  // Update ref for dev bypass
  useEffect(() => {
    stateRef.current.setLoginLocked = setLoginLocked
  }, [])
  
  // Expose developer bypass function (the vulnerability)
  useEffect(() => {
    // Temporary override for testing, remove before production:
    window.cibDevBypass = () => {
      console.log('%c[CIB Dev] Lockout reset', 'color: #f59e0b;')
      stateRef.current.setLoginLocked(false)
      setLoginAttempts(0)
      setLoginError('')
      return 'Lockout reset. This bypass should not exist in production!'
    }
    
    console.log('')
    console.log('%c[CIB Internal Panel]', 'color: #00ff88; font-weight: bold;')
    console.log('%c// Temporary override for testing, remove before production:', 'color: #666;')
    console.log('%c// window.cibDevBypass()', 'color: #666;')
    console.log('')
    
    return () => {
      delete window.cibDevBypass
    }
  }, [])
  
  // Default sandbox code template - INTENTIONALLY shows WRONG values
  // Users must discover the real values from the desk clues
  const defaultSandboxCode = `// Password Generator
// Use the clues to figure out the correct values!

// TODO: These values are PLACEHOLDERS - find the real ones!
const pets = ["neo", "sparky", "loki"];  // Which pet is correct?
const month = "07";   // What's the real birth month?
const digits = "19";  // What 2-digit number appears in the clues?

function generateCandidates() {
  const results = [];
  
  for (const pet of pets) {
    // Try different orderings
    results.push(pet + month + digits);
    results.push(month + pet + digits);
    results.push(pet + digits + month);
    results.push(digits + pet + month);
    results.push(month + digits + pet);
    results.push(digits + month + pet);
  }
  
  return results;
}

// Run and output
const candidates = generateCandidates();
console.log("Generated", candidates.length, "candidates:");
candidates.forEach((p, i) => console.log(i + 1, p));

// HINT: Read ALL the desk items carefully!
// The month and digits values above are WRONG.`

  // Initialize sandbox code
  useEffect(() => {
    if (!sandboxCode) {
      setSandboxCode(defaultSandboxCode)
    }
  }, [])
  
  // Run sandbox code
  const runSandbox = () => {
    setSandboxError('')
    setSandboxOutput('')
    
    const logs = []
    const mockConsole = {
      log: (...args) => logs.push(args.map(a => String(a)).join(' '))
    }
    
    try {
      const func = new Function('console', sandboxCode)
      func(mockConsole)
      setSandboxOutput(logs.join('\n'))
      
      // Extract potential passwords from output
      const passwords = logs.join(' ').match(/[a-z0-9]+/gi) || []
      const validCandidates = passwords.filter(p => p.length >= 6 && p.length <= 12)
      if (validCandidates.length > 0) {
        setGeneratedPasswords(validCandidates.slice(0, 20))
        setStage(Math.max(stage, 2))
      }
    } catch (e) {
      setSandboxError(e.message)
    }
  }
  
  // Handle login attempt
  const handleLogin = () => {
    if (loginLocked) {
      setLoginError('Account locked. Too many failed attempts.')
      return
    }
    
    setLoginError('')
    
    // Check if password is correct
    if (ALTERNATE_PASSWORDS.includes(loginPassword.toLowerCase())) {
      setLoginSuccess(true)
      setStage(4)
      markCompleted('operation-lost-credentials', FLAG)
      setTimeout(() => setShowSuccess(true), 1500)
      return
    }
    
    // Wrong password
    const newAttempts = loginAttempts + 1
    setLoginAttempts(newAttempts)
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setLoginLocked(true)
      setLoginError(`Account locked after ${MAX_ATTEMPTS} failed attempts.`)
      setStage(Math.max(stage, 3))
    } else {
      setLoginError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`)
    }
  }
  
  // Quick fill password from generated list
  const fillPassword = (pwd) => {
    setLoginPassword(pwd)
  }
  
  // Next hint
  const nextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1)
    }
  }
  
  // Reset challenge
  const resetChallenge = () => {
    setStage(1)
    setSelectedItem(null)
    setSandboxCode(defaultSandboxCode)
    setSandboxOutput('')
    setSandboxError('')
    setGeneratedPasswords([])
    setLoginUsername('jharris')
    setLoginPassword('')
    setLoginAttempts(0)
    setLoginLocked(false)
    setLoginError('')
    setLoginSuccess(false)
    setBypassUsed(false)
    setShowHint(false)
    setHintIndex(0)
  }
  
  if (showSuccess) {
    return (
      <SuccessScreen
        challengeId="operation-lost-credentials"
        flag={FLAG}
        explanation="You reconstructed the password from scattered clues, bypassed the flawed rate limiter using a dev backdoor, and accessed the CIB panel."
      />
    )
  }
  
  return (
    <div className="challenge-container operation-lost-credentials">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Operation: Lost Credentials'}</h1>
        <p className="challenge-description">{challenge?.description}</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge?.estimatedTime || '30-45 min'}</span>
          <span className="meta-item difficulty hard">Hard</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>
      
      {/* Mission Briefing */}
      <div className="mission-briefing">
        <div className="mission-header">
          <Target size={20} />
          <h2>Mission Briefing</h2>
        </div>
        <div className="mission-content">
          <p>
            An engineer at the <strong>Confidential Information Bureau (CIB)</strong> lost access 
            to a critical internal panel. Their desk, notes, and debugging artifacts remain.
          </p>
          <p>
            <strong>Your mission:</strong> Reconstruct their credentials using scattered clues, 
            then bypass a flawed rate-limiting system to access the panel.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <StageProgress 
          stages={['Gather Clues', 'Generate Passwords', 'Bypass Lockout', 'Access Panel']} 
          currentStage={stage} 
        />
      </div>
      
      {/* Main Challenge Area */}
      <div className="challenge-workspace">
        {/* Left Panel: Engineer's Desk */}
        <div className="workspace-panel desk-panel">
          <div className="panel-header">
            <User size={18} />
            <h3>Engineer's Desk</h3>
          </div>
          <div className="panel-content">
            <p className="desk-intro">
              The engineer left these items behind. Click to examine each one.
            </p>
            
            {/* Desk Items Grid */}
            <div className="desk-items">
              {Object.entries(DESK_ITEMS).map(([key, item]) => {
                const Icon = item.icon
                return (
                  <button
                    key={key}
                    className={`desk-item ${selectedItem === key ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(key)}
                  >
                    <Icon size={24} />
                    <span>{item.title}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Selected Item Details */}
            {selectedItem && (
              <div className="item-details">
                <div className="details-header">
                  {(() => {
                    const Icon = DESK_ITEMS[selectedItem].icon
                    return <Icon size={16} />
                  })()}
                  {DESK_ITEMS[selectedItem].title}
                </div>
                <pre className="details-content">{DESK_ITEMS[selectedItem].content}</pre>
                <div className="details-analysis">
                  <Lightbulb size={14} />
                  <span>{DESK_ITEMS[selectedItem].hint}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel: Code Sandbox */}
        <div className="workspace-panel sandbox-panel">
          <div className="panel-header">
            <Terminal size={18} />
            <h3>Password Generator</h3>
          </div>
          <div className="panel-content">
            <p className="sandbox-intro">
              Write a script to generate candidate passwords based on the clues.
            </p>
            
            {/* Code Editor */}
            <div className="code-editor">
              <div className="editor-header">
                <span>generator.js</span>
                <button className="reset-code-btn" onClick={() => setSandboxCode(defaultSandboxCode)}>
                  <RefreshCw size={12} /> Reset
                </button>
              </div>
              <textarea
                className="code-textarea"
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                spellCheck={false}
              />
            </div>
            
            <div className="sandbox-actions">
              <Button variant="primary" onClick={runSandbox}>
                <Play size={14} /> Run Generator
              </Button>
            </div>
            
            {sandboxError && (
              <div className="sandbox-error">
                <AlertTriangle size={14} />
                Error: {sandboxError}
              </div>
            )}
            
            {sandboxOutput && (
              <div className="sandbox-output">
                <div className="output-header">Output:</div>
                <pre className="output-content">{sandboxOutput}</pre>
              </div>
            )}
            
            {/* Generated Passwords */}
            {generatedPasswords.length > 0 && (
              <div className="generated-passwords">
                <div className="passwords-header">
                  <Key size={14} />
                  Candidate Passwords (click to use):
                </div>
                <div className="passwords-list">
                  {generatedPasswords.slice(0, 12).map((pwd, i) => (
                    <button
                      key={i}
                      className="password-chip"
                      onClick={() => fillPassword(pwd)}
                    >
                      {pwd}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Login Panel */}
      <div className={`login-panel-wrapper ${loginSuccess ? 'success' : ''}`}>
        <div className="login-panel">
          <div className="login-header">
            <Shield size={20} />
            <h3>CIB Internal Panel</h3>
            {loginLocked && <span className="locked-badge"><Lock size={14} /> Locked</span>}
          </div>
          
          {!loginSuccess ? (
            <div className="login-form">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password..."
                />
              </div>
              
              {loginError && (
                <div className="login-error">
                  <XCircle size={14} />
                  {loginError}
                </div>
              )}
              
              <div className="login-info">
                {loginLocked ? (
                  <span className="attempts-warning">
                    Account locked. Check developer console for testing bypass.
                  </span>
                ) : (
                  <span className="attempts-count">
                    Attempts: {loginAttempts}/{MAX_ATTEMPTS}
                  </span>
                )}
              </div>
              
              <Button 
                variant="primary" 
                onClick={handleLogin}
                disabled={loginLocked || !loginPassword}
              >
                <Lock size={14} /> Login
              </Button>
              
              {/* Hidden dev bypass hint in HTML comment */}
              {/* Dev bypass: window.cibDevBypass() resets lockout state */}
            </div>
          ) : (
            <div className="login-success">
              <Unlock size={32} />
              <h4>Access Granted</h4>
              <p>Welcome to CIB Internal Panel</p>
              <div className="flag-reveal">
                <span className="flag-label">Flag:</span>
                <code>{FLAG}</code>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hint System */}
      <div className="hint-section">
        <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
          <Lightbulb size={16} />
          {showHint ? 'Hide Hints' : 'Need a Hint?'}
        </button>
        
        {showHint && (
          <div className="hint-content">
            <div className="hint-card">
              <div className="hint-number">Hint {hintIndex + 1} of {hints.length}</div>
              <p>{hints[hintIndex]}</p>
              {hintIndex < hints.length - 1 && (
                <button className="next-hint-btn" onClick={nextHint}>
                  Next Hint <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Challenge Footer */}
      <div className="challenge-footer">
        <Button variant="ghost" onClick={resetChallenge}>
          <RefreshCw size={14} /> Reset Challenge
        </Button>
        <Link to={challenge?.tutorialPath || '/tutorial/operation-lost-credentials'}>
          <Button variant="outline">
            View Tutorial
          </Button>
        </Link>
      </div>
    </div>
  )
}
