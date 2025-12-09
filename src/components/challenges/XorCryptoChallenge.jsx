import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Binary, Key, Lock, Unlock, Lightbulb, EyeOff, RefreshCw } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './XorCryptoChallenge.css'

// The secret message and key
const SECRET_MESSAGE = 'admin=true;flag=FLAG{x0r_1s_n0t_encrypt10n}'
const XOR_KEY = 0x42 // 66 in decimal, 'B' in ASCII

// Generate ciphertext from secret message
const generateCiphertext = () => {
  const bytes = []
  for (let i = 0; i < SECRET_MESSAGE.length; i++) {
    bytes.push(SECRET_MESSAGE.charCodeAt(i) ^ XOR_KEY)
  }
  return bytes
}

const CIPHERTEXT_BYTES = generateCiphertext()
const CIPHERTEXT_HEX = CIPHERTEXT_BYTES.map(b => b.toString(16).padStart(2, '0')).join('')

export default function XorCryptoChallenge() {
  const [keyInput, setKeyInput] = useState('')
  const [decodeResult, setDecodeResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [attempts, setAttempts] = useState([])
  
  const { markCompleted, isCompleted } = useProgress()
  const challenge = getChallengeById('xor-crypto')
  const alreadyCompleted = isCompleted('xor-crypto')

  // XOR decode function
  const xorDecode = (ciphertextBytes, key) => {
    const decoded = []
    for (let i = 0; i < ciphertextBytes.length; i++) {
      decoded.push(ciphertextBytes[i] ^ key)
    }
    return decoded
  }

  // Check if result is printable ASCII
  const isPrintable = (bytes) => {
    return bytes.every(b => b >= 32 && b <= 126)
  }

  // Convert bytes to string
  const bytesToString = (bytes) => {
    return bytes.map(b => String.fromCharCode(b)).join('')
  }

  // Handle decode attempt
  const handleDecode = () => {
    let key
    const input = keyInput.trim().toLowerCase()
    
    // Parse key input (supports hex like 0x42, decimal, or single char)
    if (input.startsWith('0x')) {
      key = parseInt(input, 16)
    } else if (/^\d+$/.test(input)) {
      key = parseInt(input, 10)
    } else if (input.length === 1) {
      key = input.charCodeAt(0)
    } else {
      setDecodeResult({
        success: false,
        error: 'Invalid key format. Use hex (0x42), decimal (66), or a single character.'
      })
      return
    }

    if (isNaN(key) || key < 0 || key > 255) {
      setDecodeResult({
        success: false,
        error: 'Key must be a value between 0-255 (0x00-0xFF).'
      })
      return
    }

    const decodedBytes = xorDecode(CIPHERTEXT_BYTES, key)
    const decodedString = bytesToString(decodedBytes)
    const printable = isPrintable(decodedBytes)
    
    // Record attempt
    setAttempts(prev => [...prev.slice(-9), { 
      key: `0x${key.toString(16).padStart(2, '0')} (${key})`,
      result: printable ? decodedString.substring(0, 30) + (decodedString.length > 30 ? '...' : '') : '[non-printable]',
      correct: key === XOR_KEY
    }])

    if (key === XOR_KEY) {
      setDecodeResult({
        success: true,
        decoded: decodedString,
        key: key
      })
      markCompleted('xor-crypto')
    } else {
      setDecodeResult({
        success: false,
        decoded: printable ? decodedString : null,
        key: key,
        hint: !printable 
          ? 'Result contains non-printable characters. Try a different key.'
          : 'Decoded text doesn\'t look like a valid message. Keep trying!'
      })
    }
  }

  // Reset challenge
  const handleReset = () => {
    setKeyInput('')
    setDecodeResult(null)
    setAttempts([])
  }

  const hints = [
    'XOR is a reversible operation. The same key that encrypts also decrypts.',
    'The key is a single byte (0-255). That\'s only 256 possibilities!',
    'Try keys that might produce readable ASCII. Common keys are simple values.',
    'The key is 0x42. In decimal that\'s 66, or the letter "B".',
  ]

  return (
    <div className="challenge-container xor-crypto">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'XOR Crypto Puzzle'}</h1>
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
            You've intercepted an encrypted message from HackMe Lab's internal communications. 
            Intel suggests they used a "quick and dirty" XOR cipher with a single-byte key.
          </p>
          <p>
            Your mission: Figure out the key and decode the secret message to reveal the flag.
          </p>
        </div>

        {/* Encrypted Message Panel */}
        <div className="cipher-panel">
          <div className="panel-header">
            <Lock size={20} />
            <h3>Intercepted Message</h3>
          </div>
          
          <div className="cipher-display">
            <label>Ciphertext (Hex):</label>
            <div className="ciphertext-box">
              <code>{CIPHERTEXT_HEX}</code>
            </div>
            <p className="cipher-note">
              <Binary size={14} />
              <span>{CIPHERTEXT_BYTES.length} bytes encrypted with XOR using a single-byte key</span>
            </p>
          </div>
        </div>

        {/* XOR Playground */}
        <div className="xor-playground">
          <div className="panel-header">
            <Key size={20} />
            <h3>XOR Decoder</h3>
          </div>

          <div className="decoder-controls">
            <div className="key-input-group">
              <label>Enter Key (hex, decimal, or character):</label>
              <div className="key-input-row">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="e.g., 0x42, 66, or B"
                  onKeyDown={(e) => e.key === 'Enter' && handleDecode()}
                />
                <Button variant="primary" onClick={handleDecode}>
                  <Unlock size={16} /> Decode
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>

            <div className="key-help">
              <p>Key formats:</p>
              <ul>
                <li><code>0x42</code> - Hexadecimal (0x00-0xFF)</li>
                <li><code>66</code> - Decimal (0-255)</li>
                <li><code>B</code> - Single ASCII character</li>
              </ul>
            </div>
          </div>

          {/* XOR Visual Explanation */}
          <div className="xor-visual">
            <h4>How XOR Works:</h4>
            <Terminal title="XOR Operation">
{`Ciphertext byte:  ${CIPHERTEXT_BYTES[0].toString(2).padStart(8, '0')} (0x${CIPHERTEXT_BYTES[0].toString(16)})
XOR with key:     ${keyInput ? '????????' : '????????'} (key)
────────────────────────────
Result:           ${keyInput ? '????????' : '????????'} (decrypted)

Each byte is XORed with the same key.
Same key encrypts AND decrypts!`}
            </Terminal>
          </div>

          {/* Decode Result */}
          {decodeResult && (
            <div className={`decode-result ${decodeResult.success ? 'success' : 'failure'}`}>
              {decodeResult.error ? (
                <p className="error-message">{decodeResult.error}</p>
              ) : decodeResult.success ? (
                <>
                  <div className="success-header">
                    <CheckCircle size={20} />
                    <span>Key Found: 0x{decodeResult.key.toString(16).toUpperCase()} ({decodeResult.key})</span>
                  </div>
                  <Terminal title="Decrypted Message">
                    {decodeResult.decoded}
                  </Terminal>
                </>
              ) : (
                <>
                  <div className="attempt-header">
                    <span>Key: 0x{decodeResult.key.toString(16).toUpperCase()} ({decodeResult.key})</span>
                  </div>
                  {decodeResult.decoded ? (
                    <Terminal title="Decoded Output">
                      {decodeResult.decoded}
                    </Terminal>
                  ) : (
                    <p className="non-printable">[Output contains non-printable characters]</p>
                  )}
                  <p className="hint-message">{decodeResult.hint}</p>
                </>
              )}
            </div>
          )}

          {/* Attempt History */}
          {attempts.length > 0 && (
            <div className="attempt-history">
              <h4>Recent Attempts:</h4>
              <div className="attempts-list">
                {attempts.map((attempt, i) => (
                  <div key={i} className={`attempt-entry ${attempt.correct ? 'correct' : ''}`}>
                    <span className="attempt-key">{attempt.key}</span>
                    <span className="attempt-result">{attempt.result}</span>
                    {attempt.correct && <CheckCircle size={14} className="correct-icon" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Success State */}
        {decodeResult?.success && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="xor-crypto"
              flag={challenge?.flag}
              explanation="You cracked a simple XOR cipher by finding the single-byte key. XOR 'encryption' with a repeating key is trivially breakable because: 1) The key space is tiny (256 possibilities for single-byte). 2) XOR is reversible - same operation encrypts and decrypts. 3) Real encryption uses complex algorithms like AES, not simple XOR!"
            />
          </div>
        )}

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
                <Link to="/tutorial/xor-crypto">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
