import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Eye, EyeOff, Lightbulb, RefreshCw, Image, Search, Cookie, Key, Lock, ChevronRight, AlertTriangle, FileCode } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './MetadataHeistChallenge.css'

const FLAG = 'FLAG{m3t4d4t4_tr41l_bl4z3r}'

// Simulated image metadata
const IMAGE_METADATA = {
  filename: 'company_photo.jpg',
  fileSize: '2.4 MB',
  dimensions: '4032 x 3024',
  colorSpace: 'sRGB',
  created: '2024-03-15 14:32:17',
  camera: 'iPhone 14 Pro',
  exposureTime: '1/120s',
  fNumber: 'f/1.8',
  iso: '100',
  focalLength: '24mm',
  gps: '40.7128 N, 74.0060 W',
  software: 'Adobe Photoshop 2024',
  author: 'admin@securecorp.local',
  // Decoy - looks promising but is a dead end
  keywords: 'confidential, staging, /public-portal-demo',
  // Hidden field - the real clue (only visible when showing all)
  comment: 'Internal use only. Debug: /sys-debug-7f3a | Access portal: /admin-panel-x7k9',
  xmpToolkit: 'Adobe XMP Core 6.0',
  documentId: 'xmp.did:a1b2c3d4e5f6',
}

// Simulated cookies
const INITIAL_COOKIES = {
  session_id: 'abc123def456',
  user_theme: 'dark',
  access_level: 'guest',
  verified: 'false',
  last_visit: new Date().toISOString().split('T')[0]
}

// Debug panel data - provides verification key needed for admin panel
const DEBUG_PANEL_DATA = {
  logs: [
    { time: '09:14:22', level: 'INFO', msg: 'Session validation enabled' },
    { time: '09:14:23', level: 'WARN', msg: 'Debug mode active - disable before production' },
    { time: '09:14:25', level: 'DEBUG', msg: 'Verification key fragment: verify_' },
    { time: '09:14:26', level: 'INFO', msg: 'Admin panel requires debug verification' },
    { time: '09:14:28', level: 'DEBUG', msg: 'Key suffix loaded from env: _d3bug_4cc3ss' },
  ],
  hint: 'Combine the key fragments to unlock the admin panel.'
}

// The verification key (assembled from debug logs)
const VERIFICATION_KEY = 'verify_d3bug_4cc3ss'

// The admin panel data
const ADMIN_PANEL_DATA = {
  message: 'Welcome to the admin staging area.',
  hint: 'Your access token is encoded below.',
  encodedToken: 'bTN0NGQ0dDRfaDBsZHM=',  // base64 of 'm3t4d4t4_h0lds'
  secondHint: 'Apply ROT13 to the decoded value for the final key.'
}

export default function MetadataHeistChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1)
  const [showMetadataViewer, setShowMetadataViewer] = useState(false)
  const [metadataFilter, setMetadataFilter] = useState('')
  const [foundAdminRoute, setFoundAdminRoute] = useState(false)
  const [cookies, setCookies] = useState(INITIAL_COOKIES)
  const [editingCookie, setEditingCookie] = useState(null)
  const [cookieValue, setCookieValue] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [decodedValue, setDecodedValue] = useState('')
  const [finalToken, setFinalToken] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAllMetadata, setShowAllMetadata] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  // New: Debug panel and verification
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [visitedDecoy, setVisitedDecoy] = useState(false)
  const [verificationKey, setVerificationKey] = useState('')
  const [verificationPassed, setVerificationPassed] = useState(false)
  const [verificationError, setVerificationError] = useState('')

  const challenge = getChallengeById('metadata-heist')
  const alreadyCompleted = isCompleted('metadata-heist')

  const hints = [
    'Start by examining the image metadata. Not all fields are visible by default.',
    'The "comment" field in metadata often contains hidden notes from editors.',
    'Be careful - not every path you find is the right one. Some are decoys.',
    'The comment field mentions multiple routes. Look for a debug endpoint first.',
    'The debug panel logs contain fragments of a verification key.',
    'Combine the key fragments from the debug logs to form the verification key.',
    'Once verified, you can access the admin panel. But you still need the right cookies.',
    'The encoded token uses Base64. You can decode it in the browser console with atob().',
    'ROT13 is a simple letter substitution cipher - each letter is replaced by the letter 13 positions after it.',
  ]

  // Expose helper function
  useEffect(() => {
    window.rot13 = (str) => {
      return str.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
      })
    }
    
    window.decodeToken = (encoded) => {
      try {
        return atob(encoded)
      } catch {
        return 'Invalid base64'
      }
    }

    console.log('%cMetadata Heist Challenge', 'color: #00ff88; font-size: 16px; font-weight: bold;')
    console.log('%cHelper functions available: window.rot13(str), window.decodeToken(base64)', 'color: #8b949e;')
    
    return () => {
      delete window.rot13
      delete window.decodeToken
    }
  }, [])

  // Check cookie state for access
  useEffect(() => {
    if (cookies.verified === 'true' && cookies.access_level === 'admin') {
      setAccessGranted(true)
      if (stage < 4) setStage(4)
    } else {
      setAccessGranted(false)
    }
  }, [cookies, stage])

  const filteredMetadata = Object.entries(IMAGE_METADATA).filter(([key, value]) => {
    if (!showAllMetadata && key === 'comment') return false
    if (metadataFilter) {
      return key.toLowerCase().includes(metadataFilter.toLowerCase()) ||
             value.toLowerCase().includes(metadataFilter.toLowerCase())
    }
    return true
  })

  const handleShowAllMetadata = () => {
    setShowAllMetadata(true)
    if (stage < 2) setStage(2)
  }

  const handleCookieEdit = (key) => {
    setEditingCookie(key)
    setCookieValue(cookies[key])
  }

  const saveCookieEdit = () => {
    if (editingCookie) {
      setCookies(prev => ({
        ...prev,
        [editingCookie]: cookieValue
      }))
      setEditingCookie(null)
      setCookieValue('')
    }
  }

  const visitAdminRoute = () => {
    setFoundAdminRoute(true)
  }

  const visitDecoy = () => {
    setVisitedDecoy(true)
  }

  const visitDebugPanel = () => {
    setShowDebugPanel(true)
  }

  const verifyDebugKey = () => {
    if (verificationKey.toLowerCase() === VERIFICATION_KEY.toLowerCase()) {
      setVerificationPassed(true)
      setVerificationError('')
      if (stage < 3) setStage(3)
    } else {
      setVerificationError('Invalid verification key. Check the debug logs carefully.')
    }
  }

  const verifyFinalToken = () => {
    // The correct answer is ROT13 of 'm3t4d4t4_h0lds' = 'z3g4q4g4_u0yqf'
    const decoded = 'm3t4d4t4_h0lds'
    const rot13d = 'z3g4q4g4_u0yqf'
    
    if (finalToken === decoded || finalToken === rot13d) {
      markCompleted('metadata-heist', FLAG)
      setShowSuccess(true)
    }
  }

  const resetChallenge = () => {
    setStage(1)
    setShowMetadataViewer(false)
    setMetadataFilter('')
    setFoundAdminRoute(false)
    setCookies(INITIAL_COOKIES)
    setEditingCookie(null)
    setCookieValue('')
    setAccessGranted(false)
    setDecodedValue('')
    setFinalToken('')
    setShowAllMetadata(false)
    setShowSuccess(false)
    // New state resets
    setShowDebugPanel(false)
    setVisitedDecoy(false)
    setVerificationKey('')
    setVerificationPassed(false)
    setVerificationError('')
  }

  if (showSuccess) {
    return (
      <div className="challenge-container metadata-heist">
        <div className="challenge-header">
          <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        </div>
        <SuccessScreen
          challengeId="metadata-heist"
          flag={FLAG}
          explanation="You demonstrated key forensics skills: extracting hidden metadata from files, manipulating cookies to bypass access controls, and decoding multi-layer encoded data (Base64 + ROT13). These techniques are essential for digital forensics and penetration testing!"
        />
        <div className="try-again-section">
          <Button variant="secondary" onClick={resetChallenge}>
            <RefreshCw size={16} /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="challenge-container metadata-heist">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Metadata Heist'}</h1>
        <p className="challenge-description">An image file contains hidden clues. Follow the metadata trail, manipulate cookies, and decode the final token.</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge?.estimatedTime}</span>
          <span className="meta-item difficulty">{challenge?.difficulty}</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-scenario">
          <h2><Target size={18} /> Mission</h2>
          <p>
            A leaked company photo has surfaced. Hidden within its metadata lies the first clue 
            to accessing a secret admin portal. Your job: extract the info, bypass the access controls, 
            and decode the final token.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="heist-progress">
          <div className={`progress-step ${stage >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Metadata</span>
          </div>
          <ChevronRight size={16} className="step-arrow" />
          <div className={`progress-step ${stage >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Debug</span>
          </div>
          <ChevronRight size={16} className="step-arrow" />
          <div className={`progress-step ${stage >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Access</span>
          </div>
          <ChevronRight size={16} className="step-arrow" />
          <div className={`progress-step ${stage >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Decode</span>
          </div>
        </div>

        {/* Stage 1: Image Analysis */}
        <div className="heist-section">
          <h3>
            <Image size={18} />
            Image Analysis
          </h3>
          
          <div className="image-preview">
            <div className="image-placeholder">
              <Image size={48} />
              <span>company_photo.jpg</span>
            </div>
            <Button 
              variant="secondary"
              onClick={() => setShowMetadataViewer(true)}
            >
              <Search size={16} /> Analyze Metadata
            </Button>
          </div>

          {showMetadataViewer && (
            <div className="metadata-viewer">
              <div className="metadata-header">
                <input
                  type="text"
                  placeholder="Filter metadata fields..."
                  value={metadataFilter}
                  onChange={(e) => setMetadataFilter(e.target.value)}
                  className="metadata-filter"
                />
                <button 
                  className={`show-all-btn ${showAllMetadata ? 'active' : ''}`}
                  onClick={handleShowAllMetadata}
                >
                  {showAllMetadata ? <Eye size={14} /> : <EyeOff size={14} />}
                  {showAllMetadata ? 'All Fields' : 'Show Hidden'}
                </button>
              </div>
              
              <div className="metadata-list">
                {filteredMetadata.map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`metadata-row ${key === 'comment' ? 'highlighted' : ''}`}
                  >
                    <span className="metadata-key">{key}</span>
                    <span className="metadata-value">{value}</span>
                  </div>
                ))}
              </div>

              {showAllMetadata && (
                <div className="metadata-hint">
                  <AlertTriangle size={14} />
                  The comment field contains multiple paths. Not all lead somewhere useful...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stage 2: Debug Panel & Route Discovery */}
        {stage >= 2 && (
          <div className="heist-section">
            <h3>
              <AlertTriangle size={18} />
              Route Discovery
            </h3>

            <p className="section-intro">
              The metadata revealed multiple paths. Investigate them to find what you need.
            </p>

            <div className="route-options">
              {/* Decoy Route */}
              <div className={`route-card ${visitedDecoy ? 'visited' : ''}`}>
                <div className="route-header">
                  <code>/public-portal-demo</code>
                  {visitedDecoy && <span className="route-badge dead-end">Dead End</span>}
                </div>
                {!visitedDecoy ? (
                  <Button variant="secondary" onClick={visitDecoy}>
                    Visit Portal
                  </Button>
                ) : (
                  <div className="route-result error">
                    <AlertTriangle size={14} />
                    <span>404 Not Found - This path leads nowhere.</span>
                  </div>
                )}
              </div>

              {/* Debug Panel Route */}
              <div className={`route-card ${showDebugPanel ? 'visited' : ''}`}>
                <div className="route-header">
                  <code>/sys-debug-7f3a</code>
                  {verificationPassed && <span className="route-badge success">Verified</span>}
                </div>
                {!showDebugPanel ? (
                  <Button variant="secondary" onClick={visitDebugPanel}>
                    Visit Debug Panel
                  </Button>
                ) : (
                  <div className="debug-panel-content">
                    <div className="debug-logs">
                      <div className="debug-header">System Debug Logs</div>
                      {DEBUG_PANEL_DATA.logs.map((log, i) => (
                        <div key={i} className={`debug-line ${log.level.toLowerCase()}`}>
                          <span className="log-time">{log.time}</span>
                          <span className={`log-level ${log.level.toLowerCase()}`}>[{log.level}]</span>
                          <span className="log-msg">{log.msg}</span>
                        </div>
                      ))}
                    </div>
                    {!verificationPassed && (
                      <div className="verification-form">
                        <p>{DEBUG_PANEL_DATA.hint}</p>
                        <div className="verify-input-row">
                          <input
                            type="text"
                            placeholder="Enter verification key..."
                            value={verificationKey}
                            onChange={(e) => setVerificationKey(e.target.value)}
                            className="verify-input"
                          />
                          <Button variant="primary" onClick={verifyDebugKey}>
                            Verify
                          </Button>
                        </div>
                        {verificationError && (
                          <div className="verify-error">
                            <AlertTriangle size={14} />
                            {verificationError}
                          </div>
                        )}
                      </div>
                    )}
                    {verificationPassed && (
                      <div className="verification-success">
                        <CheckCircle size={16} />
                        <span>Verification passed. Admin panel access unlocked.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Panel Route - only after verification */}
              {verificationPassed && (
                <div className={`route-card ${foundAdminRoute ? 'visited' : ''}`}>
                  <div className="route-header">
                    <code>/admin-panel-x7k9</code>
                    {accessGranted && <span className="route-badge success">Access Granted</span>}
                  </div>
                  {!foundAdminRoute ? (
                    <Button variant="primary" onClick={visitAdminRoute}>
                      Visit Admin Panel
                    </Button>
                  ) : (
                    <div className="route-result">
                      {accessGranted ? (
                        <span className="access-granted">
                          <CheckCircle size={16} />
                          Access Granted - Scroll down to continue
                        </span>
                      ) : (
                        <span className="access-denied">
                          <Lock size={16} />
                          Access Denied - Insufficient privileges
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stage 3: Cookie Manipulation */}
        {stage >= 3 && foundAdminRoute && !accessGranted && (
          <div className="heist-section">
            <h3>
              <Cookie size={18} />
              Cookie Management
            </h3>

            <div className="cookie-editor">
              <div className="cookie-header">
                <span>Current Cookies</span>
                <span className="cookie-hint">Modify cookies to gain admin access</span>
              </div>
              
              <div className="cookie-list">
                  {Object.entries(cookies).map(([key, value]) => (
                    <div key={key} className="cookie-row">
                      <span className="cookie-key">{key}</span>
                      {editingCookie === key ? (
                        <div className="cookie-edit-form">
                          <input
                            type="text"
                            value={cookieValue}
                            onChange={(e) => setCookieValue(e.target.value)}
                            className="cookie-input"
                          />
                          <button onClick={saveCookieEdit} className="save-cookie-btn">
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="cookie-value">{value}</span>
                          <button 
                            onClick={() => handleCookieEdit(key)}
                            className="edit-cookie-btn"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Decode Token */}
        {stage >= 4 && accessGranted && (
          <div className="heist-section">
            <h3>
              <FileCode size={18} />
              Admin Panel
            </h3>

            <div className="admin-panel">
              <p className="admin-message">{ADMIN_PANEL_DATA.message}</p>
              <p className="admin-hint">{ADMIN_PANEL_DATA.hint}</p>
              
              <div className="encoded-token">
                <span className="token-label">Encoded Token:</span>
                <code>{ADMIN_PANEL_DATA.encodedToken}</code>
              </div>

              <Terminal title="Decoding Steps">
{`// Step 1: Decode Base64
atob("${ADMIN_PANEL_DATA.encodedToken}")
// Result: ???

// Step 2: Apply ROT13
window.rot13("your_decoded_value_here")
// Result: ???`}
              </Terminal>

              <div className="decode-section">
                <div className="decode-step">
                  <span>Enter the final decoded token:</span>
                  <input
                    type="text"
                    placeholder="Enter final token..."
                    value={finalToken}
                    onChange={(e) => setFinalToken(e.target.value)}
                    className="decode-input"
                  />
                </div>

                <Button 
                  variant="primary"
                  onClick={verifyFinalToken}
                  disabled={!finalToken}
                >
                  <Key size={16} /> Verify Token
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="reset-section">
          <Button variant="ghost" onClick={resetChallenge}>
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
                <Link to="/tutorial/metadata-heist">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
