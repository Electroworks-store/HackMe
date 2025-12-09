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
  // Hidden field - the key clue
  comment: 'Internal use only. Access portal: /admin-panel-x7k9',
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

  const challenge = getChallengeById('metadata-heist')
  const alreadyCompleted = isCompleted('metadata-heist')

  const hints = [
    'Start by examining the image metadata. Not all fields are visible by default.',
    'The "comment" field in metadata often contains hidden notes from editors.',
    'Look for anything that resembles a URL path or route.',
    'Once you find a path, check what\'s required to access it.',
    'Cookies control your access level. Can you modify them?',
    'The encoded token uses Base64. You can decode it in the browser console with atob().',
    'ROT13 is a simple letter substitution cipher - each letter is replaced by the letter 13 positions after it.',
    'The final token format: decoded + transformed = key'
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
      if (stage < 3) setStage(3)
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
  }

  if (showSuccess || alreadyCompleted) {
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
            <span>Access</span>
          </div>
          <ChevronRight size={16} className="step-arrow" />
          <div className={`progress-step ${stage >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
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
                  The comment field contains interesting information...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stage 2: Admin Route & Cookie Manipulation */}
        {stage >= 2 && (
          <div className="heist-section">
            <h3>
              <Cookie size={18} />
              Cookie Management
            </h3>

            <div className="concept-box info">
              <div className="concept-header">
                <Key size={18} />
                <span>Found: Admin Route</span>
              </div>
              <div className="concept-content">
                <p>
                  The metadata revealed a hidden path: <code>/admin-panel-x7k9</code>
                </p>
                {!foundAdminRoute ? (
                  <Button variant="primary" onClick={visitAdminRoute}>
                    Visit Admin Panel
                  </Button>
                ) : (
                  <div className="route-status">
                    {accessGranted ? (
                      <span className="access-granted">
                        <CheckCircle size={16} />
                        Access Granted
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
            </div>

            {foundAdminRoute && !accessGranted && (
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
            )}
          </div>
        )}

        {/* Stage 3: Decode Token */}
        {stage >= 3 && accessGranted && (
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
// Result: "m3t4d4t4_h0lds"

// Step 2: Apply ROT13
window.rot13("m3t4d4t4_h0lds")
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
