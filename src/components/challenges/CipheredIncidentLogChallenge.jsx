import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, Terminal, FileText, AlertTriangle, Play, ChevronRight, Lock, Unlock, Search, Code } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import StageProgress from '../ui/StageProgress'
import './CipheredIncidentLogChallenge.css'

// ============================================
// ENCODING CONFIGURATION
// The chain: Clear text -> Base64 -> XOR with key 0x2A -> Hex bytes
// User must reverse: Hex -> XOR with 0x2A -> Base64 decode -> Clear text
// ============================================

const XOR_KEY = 0x2A // The correct key (42)

// The decoded incident log (what user should recover)
const DECODED_LOG = `[INCIDENT LOG - CLASSIFIED]
Date: 2024-10-02
Author: CIB Security Team

10:14:22 - Anomaly detected in Zone 3 perimeter
10:15:01 - Unauthorized access attempt from 192.168.44.12
10:16:33 - Shadow service /cib-shadow activated
10:17:45 - Data exfiltration detected: 2.3GB
10:18:02 - Incident suppressed by management
10:19:00 - Access keyphrase for stage 2: SHADOWGATE

END LOG - DO NOT DISTRIBUTE`

// Encode the log for the challenge
function encodeForChallenge(text) {
  // Step 1: Base64 encode
  const base64 = btoa(text)
  // Step 2: XOR each character with key
  const xored = base64.split('').map(c => c.charCodeAt(0) ^ XOR_KEY)
  // Step 3: Convert to hex string
  const hex = xored.map(b => b.toString(16).padStart(2, '0')).join(' ')
  return hex
}

// The encoded blob (computed from DECODED_LOG)
const ENCODED_BLOB = encodeForChallenge(DECODED_LOG)

// Shadow service stages
const SHADOW_STAGES = {
  1: {
    message: 'CIB Shadow Service - Stage 1 Active',
    content: 'Connection established. Keyphrase verification required.',
    hint: 'Stage 2 requires the keyphrase from the decoded incident log.',
    requiresKeyphrase: true
  },
  2: {
    message: 'CIB Shadow Service - Stage 2 Unlocked',
    content: 'Access granted. Retrieving classified report...',
    encodedReport: 'VEhFIEZJTkFMIEZMQUc6IEZMQUd7Y2liX2luY2lkZW50X3RyYWlsX2JsYXplcn0KClRoZSBDSUIgY292ZXJ1cCBpcyBub3cgZXhwb3NlZC4gVGhlIGluY2lkZW50IHdhcyBuZXZlciByZXBvcnRlZCB0byBhdXRob3JpdGllcy4=',
    hint: 'The report is Base64 encoded. Decode it to reveal the truth.'
  }
}

// The final decoded report
const FINAL_REPORT = `THE FINAL FLAG: FLAG{cib_incident_trail_blazer}

The CIB coverup is now exposed. The incident was never reported to authorities.`

const FLAG = 'FLAG{cib_incident_trail_blazer}'

// The broken decoder (user must fix this)
const BROKEN_DECODER = `function decodeIncidentBlob(hexString) {
  // CIB Security Team - Broken decoder, needs fixing
  // TODO: Fix the issues before deploying
  
  // Convert hex string to bytes
  const bytes = hexString.split(" ").map(h => parseInt(h, 16));
  
  // XOR decrypt - but what's the right key?
  const key = 0x11; // This seems wrong...
  const xored = bytes.map(b => b ^ key);
  
  // Convert to string
  const base64 = String.fromCharCode(...xored);
  
  // Decode Base64
  try {
    return atob(base64);
  } catch (e) {
    return "Decoding failed: " + e.message;
  }
}`

// The fixed decoder solution
const FIXED_DECODER = `function decodeIncidentBlob(hexString) {
  // Convert hex string to bytes
  const bytes = hexString.split(" ").map(h => parseInt(h, 16));
  
  // XOR decrypt with correct key
  const key = 0x2A; // 42 in hex
  const xored = bytes.map(b => b ^ key);
  
  // Convert to string
  const base64 = String.fromCharCode(...xored);
  
  // Decode Base64
  try {
    return atob(base64);
  } catch (e) {
    return "Decoding failed: " + e.message;
  }
}`

export default function CipheredIncidentLogChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1)
  const [decoderCode, setDecoderCode] = useState(BROKEN_DECODER)
  const [decoderOutput, setDecoderOutput] = useState('')
  const [decoderError, setDecoderError] = useState('')
  const [showEncodedBlob, setShowEncodedBlob] = useState(false)
  const [shadowStage, setShadowStage] = useState(0)
  const [keyphraseInput, setKeyphraseInput] = useState('')
  const [keyphraseError, setKeyphraseError] = useState('')
  const [showFinalReport, setShowFinalReport] = useState(false)
  const [finalFlagInput, setFinalFlagInput] = useState('')
  const [flagError, setFlagError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const textareaRef = useRef(null)
  
  const challenge = getChallengeById('ciphered-incident-log')
  const alreadyCompleted = isCompleted('ciphered-incident-log')
  
  const hints = [
    'Examine the sanitized log panel carefully. Hidden data is often stored in comments or data attributes.',
    'The encoded blob uses a common chain: Hex bytes -> XOR -> Base64. Work backwards.',
    'The broken decoder has the wrong XOR key. Try different values - the key is a common number in programming.',
    'Hint: The XOR key is 42 (0x2A in hex). This is a classic "answer to everything" reference.',
    'Once decoded, the log reveals a keyphrase. Look for "keyphrase" in the output.',
    'The shadow service at stage 2 contains another encoded message - simple Base64 this time.',
    'Use atob() in the console to decode Base64 strings.',
  ]
  
  // Expose helper functions to console
  useEffect(() => {
    window.atob = window.atob // Already exists, but make it clear
    window.btoa = window.btoa
    
    // Helper for XOR
    window.xorDecode = (hexString, key) => {
      try {
        const bytes = hexString.split(' ').map(h => parseInt(h, 16))
        const xored = bytes.map(b => b ^ key)
        return String.fromCharCode(...xored)
      } catch (e) {
        return 'Error: ' + e.message
      }
    }
    
    console.log('%c[CIB Decoder Lab]', 'color: #00ff88; font-weight: bold;')
    console.log('%cHelper functions available:', 'color: #888;')
    console.log('%c  xorDecode(hexString, key) - XOR decrypt hex bytes', 'color: #666;')
    console.log('%c  atob(base64) - Decode Base64', 'color: #666;')
    
    return () => {
      delete window.xorDecode
    }
  }, [])
  
  // Run the decoder
  const runDecoder = () => {
    setDecoderError('')
    setDecoderOutput('')
    
    try {
      // Create a sandboxed function from user code
      const userFunc = new Function('hexString', `
        ${decoderCode}
        return decodeIncidentBlob(hexString);
      `)
      
      const result = userFunc(ENCODED_BLOB)
      setDecoderOutput(result)
      
      // Check if they got the correct output
      if (result.includes('Shadow service /cib-shadow activated') || result.includes('SHADOWGATE')) {
        setStage(2)
      }
    } catch (e) {
      setDecoderError(e.message)
    }
  }
  
  // Access shadow service
  const accessShadowService = (stageNum) => {
    setShadowStage(stageNum)
    if (stageNum === 1) {
      setStage(3)
    }
  }
  
  // Submit keyphrase
  const submitKeyphrase = () => {
    setKeyphraseError('')
    if (keyphraseInput.toUpperCase() === 'SHADOWGATE') {
      setShadowStage(2)
      setStage(4)
    } else {
      setKeyphraseError('Invalid keyphrase. Check the decoded incident log.')
    }
  }
  
  // Decode final report
  const decodeFinalReport = () => {
    setShowFinalReport(true)
    setStage(5)
  }
  
  // Submit final flag
  const submitFlag = () => {
    setFlagError('')
    if (finalFlagInput.trim() === FLAG) {
      markCompleted('ciphered-incident-log', FLAG)
      setShowSuccess(true)
    } else {
      setFlagError('Incorrect flag. Decode the final report to find it.')
    }
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
    setDecoderCode(BROKEN_DECODER)
    setDecoderOutput('')
    setDecoderError('')
    setShowEncodedBlob(false)
    setShadowStage(0)
    setKeyphraseInput('')
    setKeyphraseError('')
    setShowFinalReport(false)
    setFinalFlagInput('')
    setFlagError('')
    setShowHint(false)
    setHintIndex(0)
  }
  
  if (showSuccess) {
    return (
      <SuccessScreen
        challengeId="ciphered-incident-log"
        flag={FLAG}
        explanation="You repaired a broken decoder, reversed layered encoding, and traced the CIB incident trail to uncover the truth."
      />
    )
  }
  
  return (
    <div className="challenge-container ciphered-incident-log">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Ciphered Incident Log'}</h1>
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
            The <strong>Confidential Information Bureau (CIB)</strong> published a "sanitized" 
            incident report after a security breach. Intelligence suggests the cleanup was sloppy 
            and the real data is still there, hidden behind layers of encoding.
          </p>
          <p>
            <strong>Your mission:</strong> Reconstruct the incident trail by fixing a broken decoder, 
            unraveling layered ciphers, and following the breadcrumbs to uncover what CIB tried to hide.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <StageProgress 
          stages={['Find Data', 'Fix Decoder', 'Shadow Service', 'Extract Flag']} 
          currentStage={stage} 
        />
      </div>
      
      {/* Main Challenge Area */}
      <div className="challenge-workspace">
        {/* Left Panel: Sanitized Log */}
        <div className="workspace-panel log-panel">
          <div className="panel-header">
            <FileText size={18} />
            <h3>Sanitized Incident Log</h3>
          </div>
          <div className="panel-content">
            <div className="log-viewer">
              <div className="log-entry">[2024-10-02] Public summary: minor anomaly detected in Zone 3.</div>
              <div className="log-entry">[2024-10-03] [REDACTED] User A accessed /classified/sector9</div>
              <div className="log-entry">[2024-10-04] [REDACTED] Shadow service activity detected.</div>
              <div className="log-entry">[2024-10-05] Incident closed. No further action required.</div>
              <div className="log-entry muted">--- End of sanitized report ---</div>
            </div>
            
            {/* Hidden data - visible in source/devtools */}
            <div className="technical-details">
              <button 
                className="reveal-btn"
                onClick={() => setShowEncodedBlob(!showEncodedBlob)}
              >
                <Code size={14} />
                {showEncodedBlob ? 'Hide' : 'View'} Technical Details
              </button>
              
              {showEncodedBlob && (
                <div className="encoded-section">
                  <div className="encoded-label">
                    <AlertTriangle size={14} />
                    Raw encoded data found in page source:
                  </div>
                  <pre className="encoded-blob">
                    {/* This is the encoded blob users need to decode */}
                    {ENCODED_BLOB}
                  </pre>
                  <div className="encoded-hint">
                    This appears to be hex-encoded bytes. The original data may be recoverable.
                  </div>
                </div>
              )}
            </div>
            
            {/* HTML comment hint - visible in devtools */}
            {/* encoded_incident_data: See technical details above. Chain: hex -> XOR -> base64 */}
          </div>
        </div>
        
        {/* Right Panel: Decoder Lab */}
        <div className="workspace-panel decoder-panel">
          <div className="panel-header">
            <Terminal size={18} />
            <h3>Decoder Lab</h3>
          </div>
          <div className="panel-content">
            <div className="decoder-info">
              <p>
                CIB left a broken decoder in their internal tools. Fix it to recover the original data.
              </p>
              <div className="encoding-chain">
                <span className="chain-step">Hex Bytes</span>
                <ChevronRight size={14} />
                <span className="chain-step">XOR Decrypt</span>
                <ChevronRight size={14} />
                <span className="chain-step">Base64 Decode</span>
                <ChevronRight size={14} />
                <span className="chain-step">Clear Text</span>
              </div>
            </div>
            
            <div className="code-editor">
              <div className="editor-header">
                <span>decoder.js</span>
                <button className="reset-code-btn" onClick={() => setDecoderCode(BROKEN_DECODER)}>
                  <RefreshCw size={12} /> Reset
                </button>
              </div>
              <textarea
                ref={textareaRef}
                className="code-textarea"
                value={decoderCode}
                onChange={(e) => setDecoderCode(e.target.value)}
                spellCheck={false}
              />
            </div>
            
            <div className="decoder-actions">
              <Button variant="primary" onClick={runDecoder}>
                <Play size={14} /> Run Decoder
              </Button>
            </div>
            
            {decoderError && (
              <div className="decoder-error">
                <AlertTriangle size={14} />
                Error: {decoderError}
              </div>
            )}
            
            {decoderOutput && (
              <div className="decoder-output">
                <div className="output-header">Decoded Output:</div>
                <pre className="output-content">{decoderOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Shadow Service Panel - appears after decoding */}
      {stage >= 2 && (
        <div className="shadow-service-panel">
          <div className="panel-header">
            <Lock size={18} />
            <h3>CIB Shadow Service</h3>
          </div>
          <div className="panel-content">
            {shadowStage === 0 && (
              <div className="shadow-intro">
                <p>
                  The decoded log mentions a shadow service at <code>/cib-shadow</code>. 
                  This appears to be an internal CIB endpoint.
                </p>
                <Button variant="secondary" onClick={() => accessShadowService(1)}>
                  <Search size={14} /> Access Shadow Service
                </Button>
              </div>
            )}
            
            {shadowStage === 1 && (
              <div className="shadow-stage">
                <div className="stage-header">
                  <Lock size={16} />
                  {SHADOW_STAGES[1].message}
                </div>
                <p>{SHADOW_STAGES[1].content}</p>
                <p className="stage-hint">{SHADOW_STAGES[1].hint}</p>
                
                <div className="keyphrase-input">
                  <input
                    type="text"
                    placeholder="Enter keyphrase..."
                    value={keyphraseInput}
                    onChange={(e) => setKeyphraseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitKeyphrase()}
                  />
                  <Button variant="primary" onClick={submitKeyphrase}>
                    Verify
                  </Button>
                </div>
                
                {keyphraseError && (
                  <div className="keyphrase-error">
                    <AlertTriangle size={14} /> {keyphraseError}
                  </div>
                )}
              </div>
            )}
            
            {shadowStage === 2 && (
              <div className="shadow-stage unlocked">
                <div className="stage-header success">
                  <Unlock size={16} />
                  {SHADOW_STAGES[2].message}
                </div>
                <p>{SHADOW_STAGES[2].content}</p>
                
                <div className="encoded-report">
                  <div className="report-label">Encrypted Report Retrieved:</div>
                  <pre className="report-data">{SHADOW_STAGES[2].encodedReport}</pre>
                  <p className="report-hint">{SHADOW_STAGES[2].hint}</p>
                </div>
                
                {!showFinalReport ? (
                  <Button variant="secondary" onClick={decodeFinalReport}>
                    <Code size={14} /> Decode Report (use atob in console)
                  </Button>
                ) : (
                  <div className="final-report">
                    <div className="report-label">Decoded Report:</div>
                    <pre className="report-content">{FINAL_REPORT}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Flag Submission */}
      {stage >= 5 && (
        <div className="flag-submission">
          <div className="submission-header">
            <Target size={18} />
            <h3>Submit Flag</h3>
          </div>
          <div className="submission-content">
            <p>Enter the flag you discovered to complete the mission.</p>
            <div className="flag-input-group">
              <input
                type="text"
                placeholder="FLAG{...}"
                value={finalFlagInput}
                onChange={(e) => setFinalFlagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitFlag()}
              />
              <Button variant="primary" onClick={submitFlag}>
                Submit Flag
              </Button>
            </div>
            {flagError && (
              <div className="flag-error">
                <AlertTriangle size={14} /> {flagError}
              </div>
            )}
          </div>
        </div>
      )}
      
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
      
      {/* Reset Button */}
      <div className="challenge-footer">
        <Button variant="ghost" onClick={resetChallenge}>
          <RefreshCw size={14} /> Reset Challenge
        </Button>
        <Link to={challenge?.tutorialPath || '/tutorial/ciphered-incident-log'}>
          <Button variant="outline">
            View Tutorial
          </Button>
        </Link>
      </div>
    </div>
  )
}
