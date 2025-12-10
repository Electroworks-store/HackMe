import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lightbulb, RefreshCw, MessageSquare, FileText, AlertTriangle, Play, ChevronRight, Lock, Unlock, Send, Wifi, Code, Eye, Database } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './BreachedChatServerChallenge.css'

// ============================================
// CRC32 IMPLEMENTATION
// A simple CRC32 for signature verification
// ============================================

function crc32(str) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i)
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0')
}

// ============================================
// CHAT PACKET DATA
// Simulated chat server traffic
// ============================================

const INITIAL_PACKETS = [
  { id: 1, msg: 'user alice joined channel #general', nonce: 101, sig: null, type: 'system' },
  { id: 2, msg: 'alice: Good morning everyone', nonce: 102, sig: null, type: 'user' },
  { id: 3, msg: 'user bob joined channel #general', nonce: 103, sig: null, type: 'system' },
  { id: 4, msg: 'bob: Hey Alice!', nonce: 104, sig: null, type: 'user' },
  { id: 5, msg: 'admin: Reminder - rotate keys at 13:00', nonce: 105, sig: null, type: 'admin' },
  { id: 6, msg: 'alice: Will do, thanks admin', nonce: 106, sig: null, type: 'user' },
  { id: 7, msg: 'admin: request shadow_report', nonce: 107, sig: null, type: 'admin', highlight: true },
  { id: 8, msg: 'system: shadow_report access logged', nonce: 108, sig: null, type: 'system' },
]

// Generate signatures for packets
INITIAL_PACKETS.forEach(p => {
  p.sig = crc32(p.msg + p.nonce)
})

// The admin command to forge
const ADMIN_COMMAND = 'admin: request shadow_report'

// Shadow report data
const SHADOW_REPORT = {
  encoded: 'Q0lCIFNIQURPVyBSRVBPUlQgLSBDTEFTU0lGSUVECgpJbmNpZGVudCBJRDogU1ItMjAyNC0wMDQyCkRhdGU6IDIwMjQtMTAtMTUKU3RhdHVzOiBTVVBQUkVTU0VECgpGaW5kaW5nczoKLSBVbmF1dGhvcml6ZWQgYWNjZXNzIHRvIGNvcmUgc3lzdGVtcyBkZXRlY3RlZAotIERhdGEgZXhmaWx0cmF0aW9uOiAzLjJHQiBzZW5zaXRpdmUgcmVjb3JkcwotIEF0dGFja2VyIHVzZWQgd2VhayBzaWduYXR1cmUgc2NoZW1lIHRvIGZvcmdlIG1lc3NhZ2VzCgpGTEFHOiBGTEFHe2NpYl9jaGF0X3Byb3RvY29sX2JyZWFjaGVkfQoKVGhpcyByZXBvcnQgd2FzIG5ldmVyIHN1Ym1pdHRlZCB0byBhdXRob3JpdGllcy4=',
  decoded: `CIB SHADOW REPORT - CLASSIFIED

Incident ID: SR-2024-0042
Date: 2024-10-15
Status: SUPPRESSED

Findings:
- Unauthorized access to core systems detected
- Data exfiltration: 3.2GB sensitive records
- Attacker used weak signature scheme to forge messages

FLAG: FLAG{cib_chat_protocol_breached}

This report was never submitted to authorities.`
}

const FLAG = 'FLAG{cib_chat_protocol_breached}'

// Broken forger template
const BROKEN_FORGER = `function forgePacket(msg, nonce) {
  // CIB Protocol Lab - Build a packet forger
  // The signature scheme uses CRC32
  
  // TODO: Calculate the correct signature
  const sig = "????????"; // How is this computed?
  
  return {
    msg: msg,
    nonce: nonce,
    sig: sig
  };
}`

export default function BreachedChatServerChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [stage, setStage] = useState(1)
  const [packets, setPackets] = useState(INITIAL_PACKETS)
  const [selectedPacket, setSelectedPacket] = useState(null)
  const [forgerCode, setForgerCode] = useState(BROKEN_FORGER)
  const [forgerOutput, setForgerOutput] = useState(null)
  const [forgerError, setForgerError] = useState('')
  const [forgedPackets, setForgedPackets] = useState([])
  const [serverResponse, setServerResponse] = useState(null)
  const [showShadowReport, setShowShadowReport] = useState(false)
  const [decodedReport, setDecodedReport] = useState('')
  const [finalFlagInput, setFinalFlagInput] = useState('')
  const [flagError, setFlagError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [testMsg, setTestMsg] = useState('')
  const [testNonce, setTestNonce] = useState('')
  const packetListRef = useRef(null)
  
  const challenge = getChallengeById('breached-chat-server')
  const alreadyCompleted = isCompleted('breached-chat-server')
  
  const hints = [
    'Study the packet inspector. Notice how signatures change with each message.',
    'The protocol notes reveal the signing scheme: sig = crc32(msg + nonce)',
    'A crc32() helper function is available in the sandbox. Use it to compute signatures.',
    'To forge a packet, you need to call crc32(msg + nonce) and return the result as sig.',
    'Look at the admin command in packet #7: "admin: request shadow_report"',
    'Forge a packet with the admin command and a new nonce (e.g., 200) to bypass detection.',
    'The shadow report is Base64 encoded. Use atob() to decode it.',
  ]
  
  // Expose helper functions to console
  useEffect(() => {
    window.crc32 = crc32
    
    console.log('%c[CIB Protocol Lab]', 'color: #00ff88; font-weight: bold;')
    console.log('%cHelper functions available:', 'color: #888;')
    console.log('%c  crc32(str) - Calculate CRC32 hash', 'color: #666;')
    console.log('%c  atob(base64) - Decode Base64', 'color: #666;')
    console.log('')
    console.log('%cExample: crc32("test123") returns', 'color: #666;', crc32("test123"))
    
    return () => {
      delete window.crc32
    }
  }, [])
  
  // Run the forger code
  const runForger = () => {
    setForgerError('')
    setForgerOutput(null)
    
    const msg = testMsg || 'test message'
    const nonce = parseInt(testNonce) || 200
    
    try {
      // Create sandboxed function with crc32 available
      const userFunc = new Function('msg', 'nonce', 'crc32', `
        ${forgerCode}
        return forgePacket(msg, nonce);
      `)
      
      const result = userFunc(msg, nonce, crc32)
      
      // Validate result structure
      if (!result || typeof result !== 'object') {
        setForgerError('Function must return an object')
        return
      }
      
      if (!result.msg || !result.nonce || !result.sig) {
        setForgerError('Packet must have msg, nonce, and sig fields')
        return
      }
      
      setForgerOutput(result)
      
      // Check if the signature is correct
      const expectedSig = crc32(result.msg + result.nonce)
      if (result.sig === expectedSig) {
        setStage(Math.max(stage, 2))
      }
    } catch (e) {
      setForgerError(e.message)
    }
  }
  
  // Send forged packet
  const sendForgedPacket = () => {
    if (!forgerOutput) return
    
    const expectedSig = crc32(forgerOutput.msg + forgerOutput.nonce)
    
    if (forgerOutput.sig !== expectedSig) {
      setServerResponse({
        type: 'error',
        message: 'Signature verification failed. Invalid packet rejected.'
      })
      return
    }
    
    // Check if it's the admin command
    if (forgerOutput.msg === ADMIN_COMMAND || forgerOutput.msg === 'admin: request shadow_report') {
      setServerResponse({
        type: 'success',
        message: 'Packet accepted. Admin command executed.',
        data: {
          type: 'shadow_report',
          content: 'Report retrieved. See decoded output below.',
          encoded: SHADOW_REPORT.encoded
        }
      })
      setShowShadowReport(true)
      setStage(3)
      
      // Add to forged packets list
      setForgedPackets(prev => [...prev, {
        ...forgerOutput,
        id: packets.length + forgedPackets.length + 1,
        type: 'forged'
      }])
    } else {
      setServerResponse({
        type: 'info',
        message: `Packet accepted. Message "${forgerOutput.msg}" processed.`
      })
      
      // Add to forged packets list
      setForgedPackets(prev => [...prev, {
        ...forgerOutput,
        id: packets.length + forgedPackets.length + 1,
        type: 'forged'
      }])
    }
  }
  
  // Decode shadow report
  const decodeReport = () => {
    try {
      const decoded = atob(SHADOW_REPORT.encoded)
      setDecodedReport(decoded)
      setStage(4)
    } catch (e) {
      setDecodedReport('Decoding failed: ' + e.message)
    }
  }
  
  // Submit final flag
  const submitFlag = () => {
    setFlagError('')
    if (finalFlagInput.trim() === FLAG) {
      markCompleted('breached-chat-server', FLAG)
      setShowSuccess(true)
    } else {
      setFlagError('Incorrect flag. Check the decoded shadow report.')
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
    setPackets(INITIAL_PACKETS)
    setSelectedPacket(null)
    setForgerCode(BROKEN_FORGER)
    setForgerOutput(null)
    setForgerError('')
    setForgedPackets([])
    setServerResponse(null)
    setShowShadowReport(false)
    setDecodedReport('')
    setFinalFlagInput('')
    setFlagError('')
    setShowHint(false)
    setHintIndex(0)
    setTestMsg('')
    setTestNonce('')
  }
  
  if (showSuccess) {
    return (
      <SuccessScreen
        challengeId="breached-chat-server"
        flag={FLAG}
        explanation="You reversed the weak CRC32 signing scheme, forged admin packets, and exfiltrated the classified CIB shadow report."
      />
    )
  }
  
  return (
    <div className="challenge-container breached-chat-server">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Breached Chat Server'}</h1>
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
            The <strong>Confidential Information Bureau (CIB)</strong> uses an internal "secure" 
            chat system for sensitive communications. Intelligence has obtained a feed of their 
            chat packets.
          </p>
          <p>
            <strong>Your mission:</strong> Study the protocol, reverse their weak signature scheme, 
            forge admin commands, and extract the shadow report they tried to hide.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="mission-progress">
          <div className={`progress-step ${stage >= 1 ? 'active' : ''} ${stage > 1 ? 'complete' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Study Protocol</span>
          </div>
          <div className={`progress-step ${stage >= 2 ? 'active' : ''} ${stage > 2 ? 'complete' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Build Forger</span>
          </div>
          <div className={`progress-step ${stage >= 3 ? 'active' : ''} ${stage > 3 ? 'complete' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Forge Command</span>
          </div>
          <div className={`progress-step ${stage >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span>
            <span className="step-label">Extract Report</span>
          </div>
        </div>
      </div>
      
      {/* Main Challenge Area */}
      <div className="challenge-workspace">
        {/* Left Panel: Packet Inspector */}
        <div className="workspace-panel packet-panel">
          <div className="panel-header">
            <Wifi size={18} />
            <h3>Packet Inspector</h3>
          </div>
          <div className="panel-content">
            {/* Protocol Notes */}
            <div className="protocol-notes">
              <div className="notes-header">
                <Code size={14} />
                Protocol Notes
              </div>
              <pre className="notes-code">{`// CIB Chat Protocol v2.1 (Legacy)
// Signing scheme for packet validation:
//
// sig = crc32(msg + nonce)
//
// WARNING: This is a weak design.
// CRC32 is not cryptographically secure.`}</pre>
            </div>
            
            {/* Packet List */}
            <div className="packet-list" ref={packetListRef}>
              <div className="packet-list-header">
                <span>ID</span>
                <span>Message</span>
                <span>Nonce</span>
                <span>Signature</span>
              </div>
              {[...packets, ...forgedPackets].map((packet) => (
                <div 
                  key={packet.id}
                  className={`packet-row ${packet.type} ${selectedPacket?.id === packet.id ? 'selected' : ''} ${packet.highlight ? 'highlight' : ''}`}
                  onClick={() => setSelectedPacket(packet)}
                >
                  <span className="packet-id">#{packet.id}</span>
                  <span className="packet-msg">{packet.msg}</span>
                  <span className="packet-nonce">{packet.nonce}</span>
                  <span className="packet-sig">{packet.sig}</span>
                </div>
              ))}
            </div>
            
            {/* Selected Packet Details */}
            {selectedPacket && (
              <div className="packet-details">
                <div className="details-header">
                  <Eye size={14} />
                  Packet Details
                </div>
                <pre className="details-json">{JSON.stringify(selectedPacket, null, 2)}</pre>
                <div className="details-verify">
                  <span className="verify-label">Verify:</span>
                  <code>crc32("{selectedPacket.msg}" + {selectedPacket.nonce})</code>
                  <span className="verify-result">= {crc32(selectedPacket.msg + selectedPacket.nonce)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel: Protocol Lab */}
        <div className="workspace-panel forger-panel">
          <div className="panel-header">
            <MessageSquare size={18} />
            <h3>Protocol Lab</h3>
          </div>
          <div className="panel-content">
            <div className="lab-info">
              <p>
                Build a packet forger to create valid packets with arbitrary messages.
                The <code>crc32()</code> function is available in this sandbox.
              </p>
            </div>
            
            {/* Code Editor */}
            <div className="code-editor">
              <div className="editor-header">
                <span>forger.js</span>
                <button className="reset-code-btn" onClick={() => setForgerCode(BROKEN_FORGER)}>
                  <RefreshCw size={12} /> Reset
                </button>
              </div>
              <textarea
                className="code-textarea"
                value={forgerCode}
                onChange={(e) => setForgerCode(e.target.value)}
                spellCheck={false}
              />
            </div>
            
            {/* Test Inputs */}
            <div className="test-inputs">
              <div className="input-group">
                <label>Test Message:</label>
                <input
                  type="text"
                  placeholder="admin: request shadow_report"
                  value={testMsg}
                  onChange={(e) => setTestMsg(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Nonce:</label>
                <input
                  type="number"
                  placeholder="200"
                  value={testNonce}
                  onChange={(e) => setTestNonce(e.target.value)}
                />
              </div>
            </div>
            
            <div className="forger-actions">
              <Button variant="secondary" onClick={runForger}>
                <Play size={14} /> Test Forger
              </Button>
              {forgerOutput && (
                <Button variant="primary" onClick={sendForgedPacket}>
                  <Send size={14} /> Send Forged Packet
                </Button>
              )}
            </div>
            
            {forgerError && (
              <div className="forger-error">
                <AlertTriangle size={14} />
                Error: {forgerError}
              </div>
            )}
            
            {forgerOutput && (
              <div className="forger-output">
                <div className="output-header">Forged Packet:</div>
                <pre className="output-content">{JSON.stringify(forgerOutput, null, 2)}</pre>
                {forgerOutput.sig === crc32(forgerOutput.msg + forgerOutput.nonce) ? (
                  <div className="sig-valid">Signature valid</div>
                ) : (
                  <div className="sig-invalid">Signature invalid - will be rejected</div>
                )}
              </div>
            )}
            
            {/* Server Response */}
            {serverResponse && (
              <div className={`server-response ${serverResponse.type}`}>
                <div className="response-header">
                  <Database size={14} />
                  Server Response
                </div>
                <p>{serverResponse.message}</p>
                {serverResponse.data && (
                  <div className="response-data">
                    <pre>{JSON.stringify(serverResponse.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Shadow Report Panel */}
      {showShadowReport && (
        <div className="shadow-report-panel">
          <div className="panel-header">
            <FileText size={18} />
            <h3>CIB Shadow Report</h3>
          </div>
          <div className="panel-content">
            <div className="encoded-report">
              <div className="report-label">Encoded Report (Base64):</div>
              <pre className="report-data">{SHADOW_REPORT.encoded}</pre>
            </div>
            
            {!decodedReport ? (
              <Button variant="secondary" onClick={decodeReport}>
                <Code size={14} /> Decode Report
              </Button>
            ) : (
              <div className="decoded-report">
                <div className="report-label success">Decoded Report:</div>
                <pre className="report-content">{decodedReport}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Flag Submission */}
      {stage >= 4 && (
        <div className="flag-submission">
          <div className="submission-header">
            <Target size={18} />
            <h3>Submit Flag</h3>
          </div>
          <div className="submission-content">
            <p>Enter the flag from the shadow report to complete the mission.</p>
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
      
      {/* Challenge Footer */}
      <div className="challenge-footer">
        <Button variant="ghost" onClick={resetChallenge}>
          <RefreshCw size={14} /> Reset Challenge
        </Button>
        <Link to={challenge?.tutorialPath || '/tutorial/breached-chat-server'}>
          <Button variant="outline">
            View Tutorial
          </Button>
        </Link>
      </div>
    </div>
  )
}
