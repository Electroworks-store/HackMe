import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Binary, Key, Lock, Unlock, Lightbulb, EyeOff, RefreshCw, Zap, Search, Play, Square, Code, Puzzle, Trash2, RotateCcw, ArrowDown, Repeat, Shuffle, Save } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './XorCryptoChallenge.css'

// The secret message - admin cookie with hidden flag
const SECRET_MESSAGE = 'session=admin;role=superuser;flag=FLAG{x0r_1s_n0t_encrypt10n}'
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

// Code building blocks for brute force tool
const CODE_BLOCKS = {
  loop: {
    id: 'loop',
    label: 'Loop through keys',
    code: 'for (let key = 0; key <= 255; key++)',
    description: 'Try all 256 possible single-byte keys',
    Icon: Repeat
  },
  xor: {
    id: 'xor',
    label: 'XOR decrypt',
    code: 'decrypted = ciphertext.map(b => b ^ key)',
    description: 'XOR each byte with the current key',
    Icon: Shuffle
  },
  check: {
    id: 'check',
    label: 'Check readability',
    code: 'if (isReadable(decrypted))',
    description: 'Test if output looks like readable text',
    Icon: Search
  },
  store: {
    id: 'store',
    label: 'Save result',
    code: 'results.push({ key, text, score })',
    description: 'Store potential matches with their scores',
    Icon: Save
  }
}

// Correct order for brute force algorithm
const CORRECT_ORDER = ['loop', 'xor', 'check', 'store']

// Helper: Check if bytes look like readable text (heuristic)
const calculateReadability = (bytes) => {
  let score = 0
  let printable = 0
  let letters = 0
  let commonChars = 0
  
  for (const b of bytes) {
    if (b >= 32 && b <= 126) printable++
    if ((b >= 65 && b <= 90) || (b >= 97 && b <= 122)) letters++
    // Common chars: space, =, ;, a-z
    if (b === 32 || b === 61 || b === 59 || (b >= 97 && b <= 122)) commonChars++
  }
  
  const printableRatio = printable / bytes.length
  const letterRatio = letters / bytes.length
  const commonRatio = commonChars / bytes.length
  
  // Score based on ratios
  score = (printableRatio * 30) + (letterRatio * 40) + (commonRatio * 30)
  return Math.round(score)
}

export default function XorCryptoChallenge() {
  const [keyInput, setKeyInput] = useState('')
  const [decodeResult, setDecodeResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [attempts, setAttempts] = useState([])
  
  // Block builder state
  const [assembledBlocks, setAssembledBlocks] = useState([])
  const [availableBlocks, setAvailableBlocks] = useState(Object.keys(CODE_BLOCKS))
  const [toolBuilt, setToolBuilt] = useState(false)
  const [buildError, setBuildError] = useState(null)
  const [showBuildHint, setShowBuildHint] = useState(false)
  
  // Brute force state
  const [bruteForceResults, setBruteForceResults] = useState([])
  const [bruteForceRunning, setBruteForceRunning] = useState(false)
  const [bruteForceFilter, setBruteForceFilter] = useState('readable') // 'all', 'readable', 'high-score'
  const [showBruteForce, setShowBruteForce] = useState(false)
  
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
    setBruteForceResults([])
    setBruteForceRunning(false)
  }

  // Block builder functions
  const addBlock = (blockId) => {
    setAssembledBlocks(prev => [...prev, blockId])
    setAvailableBlocks(prev => prev.filter(id => id !== blockId))
    setBuildError(null)
  }

  const removeBlock = (index) => {
    const removedBlockId = assembledBlocks[index]
    setAssembledBlocks(prev => prev.filter((_, i) => i !== index))
    setAvailableBlocks(prev => [...prev, removedBlockId])
    setBuildError(null)
    setToolBuilt(false)
  }

  const resetBuilder = () => {
    setAssembledBlocks([])
    setAvailableBlocks(Object.keys(CODE_BLOCKS))
    setBuildError(null)
    setToolBuilt(false)
    setBruteForceResults([])
  }

  const verifyAndBuildTool = () => {
    // Check if blocks are in correct order
    const isCorrect = assembledBlocks.length === CORRECT_ORDER.length &&
      assembledBlocks.every((block, index) => block === CORRECT_ORDER[index])
    
    if (assembledBlocks.length !== CORRECT_ORDER.length) {
      setBuildError(`Your tool needs exactly ${CORRECT_ORDER.length} blocks. You have ${assembledBlocks.length}.`)
      return
    }
    
    if (!isCorrect) {
      // Find the first wrong block
      const firstWrongIndex = assembledBlocks.findIndex((block, i) => block !== CORRECT_ORDER[i])
      const hints = {
        0: "Think about what needs to happen first - you need to iterate through possibilities.",
        1: "After setting up the loop, what operation decrypts XOR-encrypted data?",
        2: "Once you have decrypted text, what should you check before storing it?",
        3: "Finally, you need to save the good results somewhere."
      }
      setBuildError(`Block ${firstWrongIndex + 1} is in the wrong position. ${hints[firstWrongIndex]}`)
      return
    }
    
    setBuildError(null)
    setToolBuilt(true)
  }

  // Brute force all 256 keys
  const runBruteForce = useCallback(() => {
    setBruteForceRunning(true)
    setBruteForceResults([])
    setShowBruteForce(true)
    
    const results = []
    
    for (let key = 0; key <= 255; key++) {
      const decodedBytes = xorDecode(CIPHERTEXT_BYTES, key)
      const decodedString = bytesToString(decodedBytes)
      const printable = isPrintable(decodedBytes)
      const readability = calculateReadability(decodedBytes)
      
      results.push({
        key,
        keyHex: `0x${key.toString(16).padStart(2, '0')}`,
        keyChar: key >= 32 && key <= 126 ? String.fromCharCode(key) : '',
        decoded: decodedString,
        printable,
        readability,
        preview: printable ? decodedString.substring(0, 50) : '[non-printable]'
      })
    }
    
    // Sort by readability score
    results.sort((a, b) => b.readability - a.readability)
    
    setBruteForceResults(results)
    setBruteForceRunning(false)
  }, [])

  // Filter brute force results
  const getFilteredResults = () => {
    switch (bruteForceFilter) {
      case 'readable':
        return bruteForceResults.filter(r => r.printable)
      case 'high-score':
        return bruteForceResults.filter(r => r.readability >= 50)
      default:
        return bruteForceResults
    }
  }

  // Select a key from brute force results
  const selectKey = (key) => {
    setKeyInput(`0x${key.toString(16).padStart(2, '0')}`)
  }

  const hints = [
    'XOR encryption is symmetric - the same key encrypts and decrypts.',
    'A single-byte key means only 256 possible values (0x00 to 0xFF).',
    'Use the Brute Force tool to test all keys. Look for readable English text.',
    'High readability scores indicate likely candidates. Look for text that looks like configuration data.',
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
            You've intercepted encrypted cookie data from HackMe Lab's authentication system. 
            Analysis shows they used XOR "encryption" with a single-byte key - a classic cryptographic mistake.
          </p>
          <p>
            Your mission: Crack the cipher and extract the hidden flag from the session data.
            With only 256 possible keys, brute force is your friend.
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

        {/* Brute Force Tool Builder */}
        <div className="brute-force-panel">
          <div className="panel-header">
            <Puzzle size={20} />
            <h3>Build Your Brute Force Tool</h3>
            <span className="panel-badge">256 Keys</span>
          </div>
          
          <div className="builder-intro">
            <p>
              Trying 256 keys manually would take forever. Build an automated tool by assembling the code blocks in the correct order.
            </p>
            <p className="builder-challenge">
              <Code size={16} /> Drag or click blocks to assemble the brute force algorithm.
            </p>
          </div>

          <div className="code-builder">
            {/* Available blocks */}
            <div className="available-blocks">
              <h4>Available Code Blocks:</h4>
              <div className="block-palette">
                {availableBlocks.map(blockId => {
                  const BlockIcon = CODE_BLOCKS[blockId].Icon
                  return (
                    <button
                      key={blockId}
                      className="code-block-btn"
                      onClick={() => addBlock(blockId)}
                      disabled={toolBuilt}
                    >
                      <span className="block-icon"><BlockIcon size={16} /></span>
                      <span className="block-label">{CODE_BLOCKS[blockId].label}</span>
                      <code className="block-code">{CODE_BLOCKS[blockId].code}</code>
                    </button>
                  )
                })}
                {availableBlocks.length === 0 && !toolBuilt && (
                  <p className="all-placed">All blocks placed! Click "Build Tool" to verify.</p>
                )}
              </div>
            </div>

            {/* Assembly area */}
            <div className="assembly-area">
              <h4>Your Algorithm:</h4>
              <div className={`assembled-blocks ${assembledBlocks.length === 0 ? 'empty' : ''}`}>
                {assembledBlocks.length === 0 ? (
                  <p className="assembly-placeholder">
                    <ArrowDown size={20} />
                    Click blocks above to add them here
                  </p>
                ) : (
                  assembledBlocks.map((blockId, index) => {
                    const BlockIcon = CODE_BLOCKS[blockId].Icon
                    return (
                      <div key={index} className="assembled-block">
                        <span className="block-number">{index + 1}</span>
                        <span className="block-icon"><BlockIcon size={16} /></span>
                        <div className="block-content">
                          <span className="block-label">{CODE_BLOCKS[blockId].label}</span>
                          <code className="block-code">{CODE_BLOCKS[blockId].code}</code>
                        </div>
                        {!toolBuilt && (
                          <button 
                            className="remove-block" 
                            onClick={() => removeBlock(index)}
                            title="Remove block"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Build error message */}
              {buildError && (
                <div className="build-error">
                  <span>❌ {buildError}</span>
                </div>
              )}

              {/* Build hint */}
              {!toolBuilt && assembledBlocks.length > 0 && (
                <button 
                  className="build-hint-btn"
                  onClick={() => setShowBuildHint(!showBuildHint)}
                >
                  <Lightbulb size={14} /> {showBuildHint ? 'Hide Hint' : 'Need Help?'}
                </button>
              )}
              {showBuildHint && !toolBuilt && (
                <div className="build-hint">
                  <p>Think about the logical flow:</p>
                  <ol>
                    <li>How do you try all possible keys?</li>
                    <li>What do you do with each key?</li>
                    <li>How do you know if a result is good?</li>
                    <li>What do you do with good results?</li>
                  </ol>
                </div>
              )}

              {/* Builder actions */}
              <div className="builder-actions">
                {!toolBuilt ? (
                  <>
                    <Button 
                      variant="secondary" 
                      onClick={resetBuilder}
                      disabled={assembledBlocks.length === 0}
                    >
                      <RotateCcw size={16} /> Reset
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={verifyAndBuildTool}
                      disabled={assembledBlocks.length !== 4}
                    >
                      <Code size={16} /> Build Tool
                    </Button>
                  </>
                ) : (
                  <div className="tool-built-success">
                    <CheckCircle size={18} />
                    <span>Tool built successfully!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Generated code preview */}
            {toolBuilt && (
              <div className="generated-code">
                <h4>Generated Brute Force Code:</h4>
                <Terminal title="bruteforce.js">
{`// Your assembled brute force tool
function bruteForceXOR(ciphertext) {
  const results = [];
  
  ${CODE_BLOCKS.loop.code} {
    ${CODE_BLOCKS.xor.code};
    ${CODE_BLOCKS.check.code} {
      ${CODE_BLOCKS.store.code};
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}`}
                </Terminal>
              </div>
            )}
          </div>

          {/* Run brute force (only after tool is built) */}
          {toolBuilt && (
            <div className="brute-force-controls">
              <div className="brute-actions">
                <Button 
                  variant="secondary" 
                  onClick={runBruteForce}
                  disabled={bruteForceRunning}
                >
                  {bruteForceRunning ? (
                    <><Square size={16} /> Running...</>
                  ) : (
                    <><Play size={16} /> Execute Tool</>
                  )}
                </Button>
                
                {bruteForceResults.length > 0 && (
                  <div className="filter-controls">
                    <label>Filter:</label>
                    <select 
                      value={bruteForceFilter} 
                      onChange={(e) => setBruteForceFilter(e.target.value)}
                    >
                      <option value="high-score">High Readability (≥50%)</option>
                      <option value="readable">Printable Only</option>
                      <option value="all">All Results (256)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {bruteForceResults.length > 0 && (
            <div className="brute-results">
              <div className="results-header">
                <Search size={16} />
                <span>Results sorted by readability score. Click a row to try that key.</span>
              </div>
              
              <div className="results-table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Char</th>
                      <th>Score</th>
                      <th>Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredResults().slice(0, 20).map((result, i) => (
                      <tr 
                        key={result.key}
                        className={result.key === XOR_KEY ? 'correct-key' : ''}
                        onClick={() => selectKey(result.key)}
                      >
                        <td className="key-cell">{result.keyHex}</td>
                        <td className="char-cell">{result.keyChar || '-'}</td>
                        <td className="score-cell">
                          <span className={`score ${result.readability >= 70 ? 'high' : result.readability >= 40 ? 'medium' : 'low'}`}>
                            {result.readability}%
                          </span>
                        </td>
                        <td className="preview-cell">{result.preview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {getFilteredResults().length > 20 && (
                <p className="results-more">
                  Showing top 20 of {getFilteredResults().length} results. Use filters to narrow down.
                </p>
              )}
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
