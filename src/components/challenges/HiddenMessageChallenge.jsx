import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Target, Eye, EyeOff, Lightbulb, Lock, RefreshCw, Code, Terminal as TerminalIcon, FileText } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import StageProgress from '../ui/StageProgress'
import './HiddenMessageChallenge.css'

// The secret token (base64 encoded)
const SECRET_TOKEN = 'aGFja2xhYi1zZWNyZXQtdG9rZW4tMTMzNw==' // 'hacklab-secret-token-1337' in base64

export default function HiddenMessageChallenge() {
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [stage, setStage] = useState(1)
  const [flagRevealed, setFlagRevealed] = useState(false)
  
  const { markCompleted, isCompleted } = useProgress()
  const challenge = getChallengeById('hidden-message')
  const alreadyCompleted = isCompleted('hidden-message')

  // Expose the secret reveal function on window
  useEffect(() => {
    // Stage 3: The reveal function that accepts the decoded token
    window.revealSecret = (token) => {
      if (token === 'hacklab-secret-token-1337') {
        setFlagRevealed(true)
        setStage(4)
        markCompleted('hidden-message')
        return '🎉 SUCCESS! Flag revealed below!'
      } else if (typeof token !== 'string') {
        return '❌ Error: revealSecret expects a string argument'
      } else {
        return `❌ Invalid token: "${token}". The decoded token is incorrect.`
      }
    }

    // Leave a hint in the console
    console.log('%c🔍 HackLab Challenge: The Hidden Message', 'color: #00ff88; font-size: 16px; font-weight: bold;')
    console.log('%cThere\'s a secret function available... try calling revealSecret() with the right argument!', 'color: #8b949e;')
    
    return () => {
      delete window.revealSecret
    }
  }, [markCompleted])

  // Track if overlay has been removed (for stage progression)
  useEffect(() => {
    const checkOverlay = () => {
      const overlay = document.querySelector('.classified-overlay')
      if (!overlay && stage === 1) {
        setStage(2)
      }
    }
    
    // Check periodically
    const interval = setInterval(checkOverlay, 500)
    return () => clearInterval(interval)
  }, [stage])

  const handleReset = () => {
    setStage(1)
    setFlagRevealed(false)
    window.location.reload()
  }

  const hints = [
    'Stage 1: The "CLASSIFIED" overlay is just a DOM element. Can you remove it using DevTools?',
    'In DevTools Elements tab, right-click on an element and select "Delete element" or press Delete key.',
    'Stage 2: The revealed text contains an encoded token. What encoding format uses A-Z, a-z, 0-9, +, and =?',
    'That\'s Base64! You can decode it in the browser console: atob("encodedString")',
    'Stage 3: Check the console for hints about a secret function. Call window.revealSecret() with the decoded token.',
  ]

  return (
    <div className="challenge-container hidden-message">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'The Hidden Message'}</h1>
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
            You've discovered a classified document on HackMe Corp's internal server. 
            Unfortunately, the sensitive content is obscured by security measures.
          </p>
          <p>
            Your mission: Use your browser's DevTools to uncover the hidden message, 
            decode any obfuscated data, and find the secret function to reveal the flag.
          </p>
        </div>

        {/* Stage Progress */}
        <StageProgress 
          stages={['Remove Overlay', 'Decode Token', 'Reveal Flag']} 
          currentStage={stage} 
        />

        {/* The Document Panel */}
        <div className="document-panel">
          <div className="panel-header">
            <FileText size={20} />
            <h3>Classified Document</h3>
            <span className="classification-badge">TOP SECRET</span>
          </div>

          <div className="document-content">
            {/* The Overlay - Stage 1 obstacle */}
            {stage === 1 && (
              <div className="classified-overlay" data-testid="classified-overlay">
                <Lock size={48} />
                <h4>CLASSIFIED</h4>
                <p>This content is restricted.</p>
                <p className="overlay-hint">Security clearance required.</p>
              </div>
            )}

            {/* The actual document content */}
            <div className="document-text">
              <p className="doc-header">═══════════════════════════════════════</p>
              <p className="doc-title">INTERNAL MEMO - PROJECT BLACKHAT</p>
              <p className="doc-header">═══════════════════════════════════════</p>
              <br />
              <p>TO: Security Team</p>
              <p>FROM: System Administrator</p>
              <p>SUBJECT: Emergency Access Protocol</p>
              <br />
              <p>In case of emergency, use the following authentication token:</p>
              <br />
              <div className="token-box">
                <code id="encoded-token">{SECRET_TOKEN}</code>
              </div>
              <br />
              <p className="doc-note">
                Note: Token is Base64 encoded. Decode and pass to the 
                system verification function to authenticate.
              </p>
              <br />
              <p className="doc-footer">
                Verification endpoint: <code>window.revealSecret(decodedToken)</code>
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2 Helper - Shows after overlay removed */}
        {stage >= 2 && !flagRevealed && (
          <div className="stage-helper">
            <div className="panel-header">
              <Code size={20} />
              <h3>Stage 2: Decode the Token</h3>
            </div>
            <p>
              You've uncovered the document! The token appears to be Base64 encoded.
              Use the browser console to decode it:
            </p>
            <Terminal title="Browser Console Hint">
{`// Decode Base64 in JavaScript:
atob("${SECRET_TOKEN}")

// Then call the verification function:
window.revealSecret("decoded_token_here")`}
            </Terminal>
            
            {stage === 2 && (
              <div className="manual-advance">
                <p className="helper-note">
                  <TerminalIcon size={14} /> Open DevTools console (F12 → Console) and decode the token!
                </p>
                <button 
                  className="advance-btn"
                  onClick={() => setStage(3)}
                >
                  I've decoded the token →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage 3 Helper */}
        {stage === 3 && !flagRevealed && (
          <div className="stage-helper">
            <div className="panel-header">
              <TerminalIcon size={20} />
              <h3>Stage 3: Call the Secret Function</h3>
            </div>
            <p>
              Now that you have the decoded token, call the <code>revealSecret()</code> function 
              in the browser console with the token as an argument.
            </p>
            <Terminal title="Final Step">
{`// In your browser console, run:
window.revealSecret("your_decoded_token_here")

// If correct, the flag will be revealed!`}
            </Terminal>
          </div>
        )}

        {/* Success State */}
        {flagRevealed && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="hidden-message"
              flag={challenge?.flag}
              explanation="You demonstrated three key hacking techniques: 1) DOM manipulation - removing visual obstacles using DevTools Elements inspector. 2) Encoding recognition and decoding - identifying Base64 and using atob() to decode it. 3) JavaScript console exploitation - finding and calling exposed debug functions. These skills are essential for web security testing!"
            />
          </div>
        )}

        {/* Reset Button */}
        <div className="reset-section">
          <Button variant="ghost" onClick={handleReset}>
            <RefreshCw size={16} /> Reset Challenge
          </Button>
        </div>

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
              {hints.slice(0, hintIndex).map((hint, i) => (
                <p key={i}><strong>Hint {i + 1}:</strong> {hint}</p>
              ))}
              
              {hintIndex < hints.length && (
                <button 
                  className="next-hint-btn"
                  onClick={() => setHintIndex(prev => prev + 1)}
                >
                  Next Hint
                </button>
              )}
              
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/hidden-message">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
