import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Binary, Key, Lock, Unlock, XCircle, Lightbulb, EyeOff, Search, Copy, Check, ShieldCheck, ShieldX } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './Base64Challenge.css'

// Regular user token (this is what user sees first)
const USER_DATA = {
  username: 'guest',
  role: 'user',
  accessLevel: 'basic',
  exp: '2025-12-31'
}

const USER_TOKEN = btoa(JSON.stringify(USER_DATA))

export default function Base64Challenge() {
  const [decodedInput, setDecodedInput] = useState('')
  const [tokenSubmit, setTokenSubmit] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [decodeResult, setDecodeResult] = useState(null)
  const [accessResult, setAccessResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('base64-token')
  const alreadyCompleted = isCompleted('base64-token')

  const handleDecode = () => {
    try {
      const decoded = atob(decodedInput.trim())
      try {
        const parsed = JSON.parse(decoded)
        setDecodeResult({ success: true, data: JSON.stringify(parsed, null, 2), parsed, isJson: true })
        if (decodedInput.trim() === USER_TOKEN && step === 1) {
          setStep(2)
        }
      } catch {
        setDecodeResult({ success: true, data: decoded, isJson: false })
      }
    } catch {
      setDecodeResult({ success: false, message: 'Invalid Base64 string! Make sure you copied it correctly.' })
    }
  }

  const handleTokenSubmit = (e) => {
    e.preventDefault()
    
    try {
      const decoded = atob(tokenSubmit.trim())
      const parsed = JSON.parse(decoded)
      
      if (parsed.role === 'admin') {
        setAccessResult({ success: true })
        markCompleted('base64-token')
      } else {
        setAccessResult({ 
          success: false, 
          message: `Access denied. Token has role="${parsed.role}". You need admin privileges.`,
          decodedRole: parsed.role
        })
      }
    } catch {
      setAccessResult({ 
        success: false, 
        message: 'Invalid token format. Make sure it\'s valid Base64 JSON.' 
      })
    }
  }

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(USER_TOKEN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setDecodedInput('')
    setTokenSubmit('')
    setDecodeResult(null)
    setAccessResult(null)
    setStep(1)
  }

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Base64 Token Decode'}</h1>
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
            You've intercepted an authentication token from network traffic. The application 
            uses these tokens to determine user access levels. Your mission:
          </p>
          <ol className="mission-steps">
            <li className={step > 1 ? 'completed' : step === 1 ? 'active' : ''}>
              <span className="step-num">1</span>
              Decode the intercepted token to understand its structure
            </li>
            <li className={step > 2 ? 'completed' : step === 2 ? 'active' : ''}>
              <span className="step-num">2</span>
              Craft your own admin token by modifying the data
            </li>
            <li className={accessResult?.success ? 'completed' : step === 2 ? 'active' : ''}>
              <span className="step-num">3</span>
              Use your crafted token to gain admin access
            </li>
          </ol>
        </div>

        {/* Step 1: Intercepted Token */}
        <div className="token-panel">
          <div className="token-header">
            <span className="token-icon"><Key size={24} /></span>
            <h3>Step 1: Intercepted Token</h3>
            <span className="step-badge">Decode this first!</span>
          </div>
          
          <div className="token-display">
            <code className="token-value">{USER_TOKEN}</code>
            <button 
              className="copy-btn" 
              onClick={handleCopyToken}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          
          <p className="token-note">
            This token belongs to a regular user. What's inside it? 🤔
          </p>
        </div>

        {/* Decoder Tool */}
        <div className="decoder-panel">
          <h3><Binary size={18} /> Base64 Decoder</h3>
          <p className="decoder-note">
            Paste any Base64 string to decode it:
          </p>
          
          <div className="decoder-input">
            <textarea
              value={decodedInput}
              onChange={(e) => setDecodedInput(e.target.value)}
              placeholder="Paste Base64 encoded string here..."
              rows={3}
            />
            <Button variant="secondary" onClick={handleDecode}>
              <Search size={16} /> Decode
            </Button>
          </div>

          {decodeResult && (
            <div className={`decode-result ${decodeResult.success ? 'success' : 'error'}`}>
              {decodeResult.success ? (
                <>
                  <h4>✓ Decoded Output:</h4>
                  <Terminal title="Decoded Data">
                    {decodeResult.data}
                  </Terminal>
                  {decodeResult.isJson && decodeResult.parsed?.role === 'user' && (
                    <div className="discovery-hint">
                      <Lightbulb size={16} />
                      <span>
                        Notice the <code>"role": "user"</code> field? What if you changed it to <code>"admin"</code> 
                        and re-encoded it?
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="error-message">{decodeResult.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Craft Your Token */}
        <div className={`craft-panel ${step >= 2 ? 'active' : 'locked'}`}>
          <div className="craft-header">
            <span className="craft-icon">{step >= 2 ? <Unlock size={24} /> : <Lock size={24} />}</span>
            <h3>Step 2: Craft Your Admin Token</h3>
          </div>
          
          {step >= 2 ? (
            <div className="craft-content">
              <p>
                Now that you understand the token structure, create your own token with 
                <code>"role": "admin"</code> and encode it in Base64.
              </p>
              
              <div className="craft-helper">
                <h4>Need to encode something?</h4>
                <p>Open your browser console (F12) and use:</p>
                <Terminal title="JavaScript Console">
{`// Create admin token data
const adminData = {
  username: "guest",
  role: "admin",
  accessLevel: "full",
  exp: "2025-12-31"
};

// Encode to Base64
btoa(JSON.stringify(adminData));`}
                </Terminal>
              </div>
            </div>
          ) : (
            <div className="craft-locked">
              <Lock size={18} />
              <p>Complete Step 1 first — decode the intercepted token to unlock this step.</p>
            </div>
          )}
        </div>

        {/* Access Panel - Submit crafted token */}
        <div className={`access-panel ${step >= 2 ? 'active' : 'locked'}`}>
          <div className="access-header">
            <span className="access-icon">
              {accessResult?.success ? <ShieldCheck size={24} /> : <ShieldX size={24} />}
            </span>
            <h3>Admin Access Panel</h3>
            <span className={`status-indicator ${accessResult?.success ? 'unlocked' : 'locked'}`}>
              {accessResult?.success ? '🔓 ACCESS GRANTED' : '🔒 LOCKED'}
            </span>
          </div>

          {!accessResult?.success && step >= 2 && (
            <form onSubmit={handleTokenSubmit} className="token-form">
              <div className="form-group">
                <label htmlFor="token">Submit your crafted admin token:</label>
                <input
                  type="text"
                  id="token"
                  value={tokenSubmit}
                  onChange={(e) => setTokenSubmit(e.target.value)}
                  placeholder="Paste your Base64-encoded admin token here..."
                  autoComplete="off"
                />
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary">
                  <Key size={16} /> Verify Token
                </Button>
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          )}

          {accessResult && !accessResult.success && (
            <div className="access-denied">
              <XCircle size={18} />
              <p>{accessResult.message}</p>
            </div>
          )}

          {step < 2 && (
            <div className="access-locked-msg">
              <p>Complete the previous steps to attempt access.</p>
            </div>
          )}
        </div>

        {/* Success State */}
        {accessResult?.success && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="base64-token"
              flag={challenge?.flag}
              explanation="You discovered that the application uses Base64 encoding for authentication tokens. But Base64 is just encoding, not encryption — anyone can decode it, modify it, and re-encode it! Remember: Encoding is NOT Encryption."
            >
              <div className="lesson-box">
                <h5>Key Lesson</h5>
                <p>
                  <strong>Encoding ≠ Encryption.</strong> Never store sensitive authorization 
                  data in client-side tokens without cryptographic signing (like JWT with 
                  HMAC signatures) or server-side validation.
                </p>
              </div>
            </SuccessScreen>
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
              <p><strong>Hint 1:</strong> Copy the intercepted token and paste it into the decoder.</p>
              <p><strong>Hint 2:</strong> The decoded data is JSON. Look for a "role" field.</p>
              <p><strong>Hint 3:</strong> Create a new JSON object with <code>"role": "admin"</code></p>
              <p><strong>Hint 4:</strong> Use <code>btoa(JSON.stringify(yourObject))</code> in the browser console to encode.</p>
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/base64-token">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
