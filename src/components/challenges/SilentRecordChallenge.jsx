import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, FileText, Database, Radio, AlertTriangle, Search, Lock, Unlock, Eye, ChevronRight, Volume2, Hash, User, MapPin, Calendar } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import StageProgress from '../ui/StageProgress'
import './SilentRecordChallenge.css'

// ============================================
// OPERATION: SILENT RECORD
// Multi-stage OSINT investigation challenge
// Requires cross-referencing documents and
// decoding a visual waveform to find the agent
// ============================================

const FINAL_FLAG = 'FLAG{4g3nt_v4l3r1a_c0nf1rm3d}'
const AGENT_CODENAME = 'VALERIA'
const DATABASE_PASSWORD = 'blackbird-7'

// Document repository - contains real intel and disinformation
const DOCUMENTS = {
  memo_01: {
    id: 'memo_01',
    title: 'Internal Memo - Project Blackbird',
    date: '2024-01-15',
    classification: 'CONFIDENTIAL',
    author: 'Director Hayes',
    content: `SUBJECT: Project Blackbird Status Update

Field operations confirm Asset SPARROW has been compromised. 
All communications through Channel 7 are to be considered tainted.

Priority reassignment: Agent VALERIA will assume primary contact 
responsibilities effective immediately. Cover identity: Elena Marchetti,
cultural attache at the Milan consulate.

Database access code updated. Remember: lowercase, hyphenated format.

- Hayes`
  },
  memo_02: {
    id: 'memo_02',
    title: 'URGENT: Security Breach Alert',
    date: '2024-01-18',
    classification: 'SECRET',
    author: 'Security Division',
    content: `** DISINFORMATION DOCUMENT **

Asset PHOENIX has been identified as the primary contact for 
Eastern European operations. All field agents should report to 
PHOENIX via dead drop location DELTA-9.

PHOENIX cover identity: Dr. Marcus Webb, university professor.

Database password: redfalcon-3

[This document flagged for review - authenticity unverified]`
  },
  personnel_file: {
    id: 'personnel_file',
    title: 'Personnel File Extract',
    date: '2024-01-10',
    classification: 'TOP SECRET',
    author: 'Human Resources',
    content: `AGENT ROSTER - ACTIVE FIELD OPERATIVES

SPARROW - Status: COMPROMISED (burned)
PHOENIX - Status: DECOMMISSIONED (cover blown 2023-09-15)
VALERIA - Status: ACTIVE, DEEP COVER
RAVEN - Status: ACTIVE, DOMESTIC
CONDOR - Status: TRAINING

Note: Only VALERIA maintains uncompromised status for 
international operations. Current assignment: Mediterranean sector.`
  },
  intercept_log: {
    id: 'intercept_log',
    title: 'Signal Intercept Log',
    date: '2024-01-20',
    classification: 'SECRET',
    author: 'SIGINT Division',
    content: `INTERCEPTED TRANSMISSION - ENCRYPTED

Source: Unknown shortwave frequency
Duration: 4.7 seconds
Pattern: Appears to be encoded audio signal

Analysis indicates possible binary encoding in waveform amplitude.
Recommend visual analysis of audio pattern.

Decoded partial: "Asset codename begins with V..."
[Transmission truncated]`
  },
  false_lead: {
    id: 'false_lead',
    title: 'Confidential Contact List',
    date: '2024-01-12',
    classification: 'CONFIDENTIAL',
    author: 'Unknown',
    content: `PRIMARY CONTACTS FOR OPERATION NIGHTFALL

ALPHA: codeword "stormcloud"
BETA: codeword "darkwater"  
GAMMA: codeword "redfalcon-3"

Note: Operation Nightfall was discontinued in 2022.
This document is OUTDATED and should not be used for 
current operations.`
  }
}

// Waveform data - encodes "VALERIA" in binary
// V=01010110, A=01000001, L=01001100, E=01000101, R=01010010, I=01001001, A=01000001
const WAVEFORM_BINARY = '01010110010000010100110001000101010100100100100101000001'

export default function SilentRecordChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1) // 1-5 stages
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [readDocuments, setReadDocuments] = useState([])
  const [dbPassword, setDbPassword] = useState('')
  const [dbUnlocked, setDbUnlocked] = useState(false)
  const [dbError, setDbError] = useState('')
  const [decodedBinary, setDecodedBinary] = useState('')
  const [decodedText, setDecodedText] = useState('')
  const [agentGuess, setAgentGuess] = useState('')
  const [guessError, setGuessError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const canvasRef = useRef(null)
  
  const challenge = getChallengeById('silent-record')
  const alreadyCompleted = isCompleted('silent-record')
  
  const hints = [
    'Read all available documents carefully. Some contain false information planted to mislead.',
    'Cross-reference agent statuses across documents. Which agents are still active and uncompromised?',
    'The database password format is mentioned in the memos. Look for "lowercase, hyphenated format".',
    'Project Blackbird + Channel 7 = the password format. Think: blackbird-7',
    'The waveform shows high and low amplitudes. High = 1, Low = 0. Read left to right.',
    'Convert the binary to ASCII: split into 8-bit groups, convert each to a character.',
    'The encoded message spells an agent codename. Match it to your document research.',
  ]

  // Draw waveform on canvas when reaching stage 4
  useEffect(() => {
    if (stage >= 4 && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      
      // Clear canvas
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, width, height)
      
      // Draw grid lines
      ctx.strokeStyle = '#1a1a2a'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }
      
      // Draw center line
      ctx.strokeStyle = '#333'
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
      
      // Draw waveform based on binary
      ctx.strokeStyle = '#00ff88'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const bitWidth = width / WAVEFORM_BINARY.length
      const highY = height * 0.25
      const lowY = height * 0.75
      
      for (let i = 0; i < WAVEFORM_BINARY.length; i++) {
        const bit = WAVEFORM_BINARY[i]
        const x = i * bitWidth
        const y = bit === '1' ? highY : lowY
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          // Draw horizontal then vertical for square wave
          const prevBit = WAVEFORM_BINARY[i - 1]
          const prevY = prevBit === '1' ? highY : lowY
          ctx.lineTo(x, prevY)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(x + bitWidth, y)
      }
      
      ctx.stroke()
      
      // Add axis labels
      ctx.fillStyle = '#666'
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText('HIGH (1)', 5, highY - 5)
      ctx.fillText('LOW (0)', 5, lowY + 15)
    }
  }, [stage])

  const handleReadDocument = (docId) => {
    setSelectedDoc(DOCUMENTS[docId])
    if (!readDocuments.includes(docId)) {
      setReadDocuments([...readDocuments, docId])
    }
  }

  const handleDbPasswordSubmit = () => {
    if (dbPassword.toLowerCase().trim() === DATABASE_PASSWORD) {
      setDbUnlocked(true)
      setDbError('')
      setStage(4)
    } else {
      setDbError('Access denied. Invalid credentials.')
    }
  }

  const handleBinaryDecode = () => {
    // Convert binary to text
    let text = ''
    for (let i = 0; i < decodedBinary.length; i += 8) {
      const byte = decodedBinary.slice(i, i + 8)
      if (byte.length === 8) {
        const charCode = parseInt(byte, 2)
        text += String.fromCharCode(charCode)
      }
    }
    setDecodedText(text)
  }

  const handleAgentSubmit = () => {
    if (agentGuess.toUpperCase().trim() === AGENT_CODENAME) {
      markCompleted('silent-record')
      setShowSuccess(true)
    } else {
      setGuessError('That agent is not the correct target. Review your intelligence.')
    }
  }

  const handleReset = () => {
    setStage(1)
    setSelectedDoc(null)
    setReadDocuments([])
    setDbPassword('')
    setDbUnlocked(false)
    setDbError('')
    setDecodedBinary('')
    setDecodedText('')
    setAgentGuess('')
    setGuessError('')
    setShowSuccess(false)
    setHintIndex(0)
    setShowHint(false)
  }
  
  const nextHint = () => {
    if (hintIndex < hints.length - 1) {
      setHintIndex(prev => prev + 1)
    }
  }

  const proceedToNextStage = () => {
    setStage(prev => prev + 1)
  }

  if (showSuccess) {
    return (
      <SuccessScreen
        flag={FINAL_FLAG}
        challengeId="silent-record"
        title="Intelligence Confirmed!"
        description={`You successfully identified Agent ${AGENT_CODENAME} as the active field operative through careful document analysis and signal decoding.`}
        learningPoints={[
          "OSINT requires cross-referencing multiple sources to identify disinformation",
          "Document metadata (dates, authors, classifications) provides credibility clues",
          "Binary encoding can be visually represented in waveforms (amplitude = bit value)",
          "Patience and systematic analysis reveal truths that rushing would miss"
        ]}
      />
    )
  }

  return (
    <div className="challenge-container silent-record-challenge">
      <Link to="/challenges" className="back-link">
        <ArrowLeft size={20} />
        Back to Challenges
      </Link>

      <div className="challenge-header">
        <div className="challenge-title-row">
          <h1>
            <Radio size={32} />
            Operation: Silent Record
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
          <span className="category">OSINT</span>
          <span className="time"><Clock size={14} /> 45-60 min</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <StageProgress 
        stages={['Documents', 'Cross-Ref', 'Database', 'Signal', 'Identify']} 
        currentStage={stage} 
      />

      <div className="mission-brief">
        <div className="brief-header">
          <Target size={20} />
          <h2>Mission Briefing</h2>
        </div>
        <div className="brief-content">
          <p>
            <strong>Confidential Information Bureau (CIB)</strong> has lost contact with a 
            field agent. Intelligence suggests the agent may have been compromised, but 
            counter-intelligence has also planted disinformation.
          </p>
          <p>
            Your mission: Analyze recovered documents, separate real intel from fake, 
            access the secure database, decode an intercepted signal, and 
            <strong> identify the still-active field agent</strong>.
          </p>
        </div>
      </div>

      {/* Stage 1: Document Analysis */}
      {stage === 1 && (
        <div className="stage-panel">
          <div className="panel-header">
            <FileText size={18} />
            <span>Stage 1: Document Analysis</span>
          </div>
          <div className="panel-content">
            <p>
              You've recovered several classified documents from a CIB drop site. 
              Review each document carefully - some may contain disinformation.
            </p>
            
            <div className="document-list">
              {Object.values(DOCUMENTS).map(doc => (
                <div 
                  key={doc.id}
                  className={`document-item ${readDocuments.includes(doc.id) ? 'read' : ''}`}
                  onClick={() => handleReadDocument(doc.id)}
                >
                  <FileText size={16} />
                  <div className="doc-info">
                    <span className="doc-title">{doc.title}</span>
                    <span className="doc-meta">{doc.classification} | {doc.date}</span>
                  </div>
                  {readDocuments.includes(doc.id) && <CheckCircle size={14} className="read-check" />}
                </div>
              ))}
            </div>

            {selectedDoc && (
              <div className="document-viewer">
                <div className="doc-header">
                  <h3>{selectedDoc.title}</h3>
                  <div className="doc-metadata">
                    <span><Calendar size={12} /> {selectedDoc.date}</span>
                    <span><User size={12} /> {selectedDoc.author}</span>
                    <span className={`classification ${selectedDoc.classification.toLowerCase().replace(' ', '-')}`}>
                      {selectedDoc.classification}
                    </span>
                  </div>
                </div>
                <div className="doc-content">
                  <pre>{selectedDoc.content}</pre>
                </div>
              </div>
            )}

            {readDocuments.length >= 3 && (
              <div className="stage-complete">
                <p>You've gathered enough intelligence. Proceed to cross-reference the documents.</p>
                <Button onClick={proceedToNextStage} variant="primary">
                  <ChevronRight size={16} />
                  Continue Investigation
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stage 2: Cross-Reference */}
      {stage === 2 && (
        <div className="stage-panel">
          <div className="panel-header">
            <Search size={18} />
            <span>Stage 2: Intelligence Cross-Reference</span>
          </div>
          <div className="panel-content">
            <p>
              Review your findings. Some documents contain planted disinformation.
              Look for inconsistencies and identify which agents are truly active.
            </p>
            
            <div className="cross-ref-notes">
              <h4>Your Notes</h4>
              <ul>
                <li>Asset SPARROW - Status mentioned in memo_01</li>
                <li>Agent PHOENIX - Multiple references, verify authenticity</li>
                <li>Agent VALERIA - Check personnel file for current status</li>
                <li>Database password - Format clue in official memo</li>
              </ul>
            </div>

            <div className="analysis-questions">
              <h4>Consider:</h4>
              <ul>
                <li>Which memo appears to be official vs. flagged for review?</li>
                <li>What is each agent's current operational status?</li>
                <li>Which password format matches the official communication style?</li>
              </ul>
            </div>

            <div className="stage-complete">
              <p>When ready, proceed to access the secure database.</p>
              <Button onClick={proceedToNextStage} variant="primary">
                <Database size={16} />
                Access Database
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: Database Access */}
      {stage === 3 && (
        <div className="stage-panel">
          <div className="panel-header">
            <Database size={18} />
            <span>Stage 3: Secure Database Access</span>
          </div>
          <div className="panel-content">
            <div className="database-interface">
              <div className="db-terminal">
                <div className="terminal-header">
                  <span>CIB SECURE DATABASE v3.2</span>
                </div>
                <div className="terminal-body">
                  <p className="terminal-line">&gt; Connecting to secure server...</p>
                  <p className="terminal-line">&gt; Connection established.</p>
                  <p className="terminal-line">&gt; Authentication required.</p>
                  <p className="terminal-line">&gt; Enter database access code:</p>
                </div>
              </div>

              <div className="db-login">
                <div className="input-group">
                  <Lock size={16} />
                  <input
                    type="password"
                    value={dbPassword}
                    onChange={(e) => {
                      setDbPassword(e.target.value)
                      setDbError('')
                    }}
                    placeholder="Enter access code..."
                    onKeyDown={(e) => e.key === 'Enter' && handleDbPasswordSubmit()}
                  />
                </div>
                <Button onClick={handleDbPasswordSubmit} variant="primary">
                  <Unlock size={16} />
                  Authenticate
                </Button>
              </div>

              {dbError && (
                <div className="db-error">
                  <AlertTriangle size={16} />
                  {dbError}
                </div>
              )}

              <div className="password-hint">
                <Eye size={14} />
                <span>Hint: The password format was mentioned in official CIB communications.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Signal Analysis */}
      {stage === 4 && (
        <div className="stage-panel">
          <div className="panel-header">
            <Radio size={18} />
            <span>Stage 4: Signal Analysis</span>
          </div>
          <div className="panel-content">
            <p>
              Database unlocked. You've retrieved an intercepted audio signal.
              The waveform appears to contain encoded data.
            </p>

            <div className="waveform-container">
              <div className="waveform-header">
                <Volume2 size={16} />
                <span>Intercepted Signal - Visual Analysis</span>
              </div>
              <canvas 
                ref={canvasRef} 
                width={700} 
                height={150}
                className="waveform-canvas"
              />
              <div className="waveform-legend">
                <span>Read amplitude levels left to right: HIGH = 1, LOW = 0</span>
              </div>
            </div>

            <div className="decode-section">
              <h4>Decode the Signal</h4>
              <p>Extract the binary sequence from the waveform and convert to text.</p>
              
              <div className="decode-input">
                <label>Binary Sequence:</label>
                <input
                  type="text"
                  value={decodedBinary}
                  onChange={(e) => setDecodedBinary(e.target.value.replace(/[^01]/g, ''))}
                  placeholder="Enter binary (e.g., 01010110...)"
                  maxLength={64}
                />
                <span className="char-count">{decodedBinary.length}/56 bits</span>
              </div>

              <Button onClick={handleBinaryDecode} variant="secondary">
                <Hash size={16} />
                Convert to ASCII
              </Button>

              {decodedText && (
                <div className="decoded-result">
                  <span>Decoded message:</span>
                  <code>{decodedText}</code>
                </div>
              )}
            </div>

            {decodedText.toUpperCase() === AGENT_CODENAME && (
              <div className="stage-complete">
                <p>Signal decoded! The message reveals an agent codename. Proceed to final confirmation.</p>
                <Button onClick={proceedToNextStage} variant="primary">
                  <ChevronRight size={16} />
                  Final Stage
                </Button>
              </div>
            )}

            {decodedText && decodedText.toUpperCase() !== AGENT_CODENAME && (
              <div className="decode-hint">
                <AlertTriangle size={14} />
                <span>The decoded text doesn't match expected agent codenames. Check your binary sequence.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stage 5: Final Confirmation */}
      {stage === 5 && (
        <div className="stage-panel final-stage">
          <div className="panel-header">
            <Target size={18} />
            <span>Stage 5: Agent Identification</span>
          </div>
          <div className="panel-content">
            <p>
              You've analyzed the documents and decoded the intercepted signal.
              Now identify the active field agent based on your investigation.
            </p>

            <div className="intel-summary">
              <h4>Intelligence Summary</h4>
              <ul>
                <li><strong>SPARROW:</strong> Compromised, no longer active</li>
                <li><strong>PHOENIX:</strong> Decommissioned since 2023</li>
                <li><strong>RAVEN:</strong> Active, domestic operations only</li>
                <li><strong>VALERIA:</strong> Active, international deep cover</li>
                <li><strong>Signal decode:</strong> {decodedText || '[Pending]'}</li>
              </ul>
            </div>

            <div className="final-submit">
              <h4>Confirm Target Agent</h4>
              <p>Enter the codename of the active international field agent:</p>
              
              <div className="submit-group">
                <input
                  type="text"
                  value={agentGuess}
                  onChange={(e) => {
                    setAgentGuess(e.target.value)
                    setGuessError('')
                  }}
                  placeholder="Agent codename..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAgentSubmit()}
                />
                <Button onClick={handleAgentSubmit} variant="primary">
                  Confirm Agent
                </Button>
              </div>

              {guessError && (
                <div className="guess-error">
                  <AlertTriangle size={16} />
                  {guessError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hint Section */}
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

      {/* Reset Section */}
      <div className="reset-section">
        <Button variant="ghost" onClick={handleReset}>
          <RefreshCw size={16} />
          Reset Challenge
        </Button>
      </div>
    </div>
  )
}
