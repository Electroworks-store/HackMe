import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Database, Search, Send, Wallet, AlertTriangle, Lightbulb, EyeOff } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './TwoPartHeistChallenge.css'

// Fake wallet database
const WALLET_DATABASE = [
  { username: 'you', coins: 5, notes: 'New user account' },
  { username: 'alice', coins: 150, notes: 'Regular user' },
  { username: 'bob', coins: 1000, notes: 'Loves collecting coins' },
  { username: 'bank', coins: 99999, notes: 'Internal liquidity pool' },
]

export default function TwoPartHeistChallenge() {
  const [queryInput, setQueryInput] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  
  // Transfer state
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [yourBalance, setYourBalance] = useState(5)
  const [transferLog, setTransferLog] = useState([])
  const [transferError, setTransferError] = useState('')
  
  // Challenge progress
  const [discoveredBank, setDiscoveredBank] = useState(false)
  const [heistComplete, setHeistComplete] = useState(false)
  
  const { markCompleted, isCompleted } = useProgress()
  const challenge = getChallengeById('two-part-heist')
  const alreadyCompleted = isCompleted('two-part-heist')

  // Generate fake SQL query
  const generateQuery = (input) => {
    return `SELECT username, coins, notes
FROM wallets
WHERE username = '${input}'`
  }

  // Handle query execution
  const handleRunQuery = () => {
    const input = queryInput.trim()
    
    if (!input) {
      setQueryResults({ error: 'Please enter a username to search.' })
      return
    }

    // Check for SQL injection patterns
    const sqliPatterns = [
      /'\s*or\s+['"]?1['"]?\s*=\s*['"]?1/i,
      /'\s*or\s+true/i,
      /'\s*or\s+1\s*--/i,
      /'\s*;\s*select/i,
      /'\s*union\s+select/i,
      /'\s*or\s+''='/i,
      /' or ''/i,
    ]

    const isInjection = sqliPatterns.some(pattern => pattern.test(input))

    if (isInjection) {
      // SQL injection detected - return all rows
      setQueryResults({
        success: true,
        injected: true,
        rows: WALLET_DATABASE,
        message: '⚠️ Query returned ALL rows! Injection successful.'
      })
      setDiscoveredBank(true)
    } else {
      // Normal query - search for exact match
      const found = WALLET_DATABASE.find(w => w.username.toLowerCase() === input.toLowerCase())
      if (found) {
        setQueryResults({
          success: true,
          injected: false,
          rows: [found],
          message: `Found 1 result for "${input}"`
        })
      } else {
        setQueryResults({
          success: false,
          rows: [],
          message: `No results found for "${input}"`
        })
      }
    }
  }

  // Handle transfer
  const handleTransfer = (e) => {
    e.preventDefault()
    setTransferError('')
    
    const to = transferTo.trim().toLowerCase()
    const amount = parseInt(transferAmount, 10)

    if (!to) {
      setTransferError('Please specify a recipient.')
      return
    }

    if (isNaN(amount) || amount === 0) {
      setTransferError('Please enter a valid amount.')
      return
    }

    const timestamp = new Date().toLocaleTimeString()

    // Check if transferring to bank with negative amount (the exploit!)
    if (to === 'bank' && amount < 0) {
      // The bug: negative transfer TO bank = you RECEIVE coins
      const gained = Math.abs(amount)
      setYourBalance(prev => prev + gained)
      setTransferLog(prev => [...prev, {
        time: timestamp,
        type: 'exploit',
        message: `💰 EXPLOIT: Transferred ${amount} to bank. System credited you ${gained} coins!`
      }])
      
      if (gained >= 1000) {
        setHeistComplete(true)
        markCompleted('two-part-heist')
      }
      return
    }

    // Check for another exploit: transferring FROM bank
    if (to === 'you' && transferTo.toLowerCase() === 'bank') {
      // Can't do this with our simple form, but leaving for future
    }

    // Normal transfer validation
    if (amount < 0) {
      // Another exploit path: negative amount to anyone means you gain
      if (to !== 'bank') {
        setTransferError('Error: Negative amounts not allowed... for most accounts.')
        return
      }
    }

    if (amount > yourBalance) {
      setTransferError(`Transaction denied: Insufficient funds. You have ${yourBalance} coins.`)
      setTransferLog(prev => [...prev, {
        time: timestamp,
        type: 'error',
        message: `❌ Failed: Tried to send ${amount} coins (balance: ${yourBalance})`
      }])
      return
    }

    // Valid transfer
    setYourBalance(prev => prev - amount)
    setTransferLog(prev => [...prev, {
      time: timestamp,
      type: 'success',
      message: `✓ Sent ${amount} coins to ${to}`
    }])
    setTransferAmount('')
  }

  // Reset challenge
  const handleReset = () => {
    setQueryInput('')
    setQueryResults(null)
    setTransferTo('')
    setTransferAmount('')
    setYourBalance(5)
    setTransferLog([])
    setTransferError('')
    setDiscoveredBank(false)
    setHeistComplete(false)
  }

  const hints = [
    'Stage 1: Try entering something other than a normal username in the query field.',
    'SQL injection payloads often use single quotes to "break out" of strings. Try: \' OR \'1\'=\'1',
    'Stage 2: Look carefully at the accounts you discovered. Is there a special one?',
    'The "bank" account seems interesting. What happens if you transfer a NEGATIVE amount to it?',
    'Try transferring -10000 coins TO the bank account. Watch what happens to your balance!'
  ]

  return (
    <div className="challenge-container two-part-heist">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'The Two-Part Heist'}</h1>
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
            You've gained access to HackMe Bank's internal wallet system. Your starting balance 
            is a measly <strong>5 coins</strong>. Your mission: become rich by any means necessary.
          </p>
          <p>
            The system has a wallet database and a transfer feature. Something tells you 
            there might be some interesting accounts... and maybe some flawed logic.
          </p>
        </div>

        {/* Stage Progress Indicator */}
        <div className="stage-progress">
          <div className={`stage-indicator ${queryResults?.injected ? 'complete' : ''}`}>
            <span className="stage-num">1</span>
            <span className="stage-label">Recon</span>
            {queryResults?.injected && <CheckCircle size={14} className="stage-check" />}
          </div>
          <div className="stage-connector"></div>
          <div className={`stage-indicator ${heistComplete ? 'complete' : ''}`}>
            <span className="stage-num">2</span>
            <span className="stage-label">Exploit</span>
            {heistComplete && <CheckCircle size={14} className="stage-check" />}
          </div>
        </div>

        {/* Stage 1: Database Query Panel */}
        <div className="query-panel">
          <div className="panel-header">
            <Database size={20} />
            <h3>Stage 1: Wallet Database Console</h3>
          </div>
          
          <p className="panel-description">
            Query the wallet database to find information about other users.
          </p>

          <div className="query-builder">
            <label>Search for user:</label>
            <div className="query-input-row">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter username..."
                onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
              />
              <Button variant="secondary" onClick={handleRunQuery}>
                <Search size={16} /> Run Query
              </Button>
            </div>
          </div>

          <div className="query-preview">
            <span className="preview-label">Generated Query:</span>
            <Terminal title="SQL Query">
              {generateQuery(queryInput || '[username]')}
            </Terminal>
          </div>

          {queryResults && (
            <div className={`query-results ${queryResults.injected ? 'injected' : ''}`}>
              <div className="results-header">
                {queryResults.injected && <AlertTriangle size={16} />}
                <span>{queryResults.message}</span>
              </div>
              
              {queryResults.rows && queryResults.rows.length > 0 && (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>username</th>
                      <th>coins</th>
                      <th>notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.rows.map((row, i) => (
                      <tr key={i} className={row.username === 'bank' ? 'highlight-row' : ''}>
                        <td>{row.username}</td>
                        <td>{row.coins.toLocaleString()}</td>
                        <td>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Stage 2: Transfer Panel */}
        <div className={`transfer-panel ${discoveredBank ? 'active' : 'locked'}`}>
          <div className="panel-header">
            <Send size={20} />
            <h3>Stage 2: Coin Transfer</h3>
            {!discoveredBank && <span className="locked-badge">🔒 Complete Stage 1</span>}
          </div>

          {discoveredBank ? (
            <>
              <div className="balance-display">
                <Wallet size={18} />
                <span>Your Balance: <strong className={yourBalance >= 10000 ? 'rich' : ''}>{yourBalance.toLocaleString()} coins</strong></span>
              </div>

              <form onSubmit={handleTransfer} className="transfer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>From:</label>
                    <input type="text" value="you" disabled className="disabled-input" />
                  </div>
                  <div className="form-group">
                    <label>To:</label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="Recipient username..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount:</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <Button type="submit" variant="primary">
                    <Send size={16} /> Transfer
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleReset}>
                    Reset Challenge
                  </Button>
                </div>
              </form>

              {transferError && (
                <div className="transfer-error">
                  <AlertTriangle size={16} />
                  {transferError}
                </div>
              )}

              {transferLog.length > 0 && (
                <div className="transfer-log">
                  <h4>Transaction Log:</h4>
                  {transferLog.map((log, i) => (
                    <div key={i} className={`log-entry ${log.type}`}>
                      <span className="log-time">[{log.time}]</span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="locked-message">
              <p>Complete Stage 1 to unlock the transfer feature.</p>
              <p className="hint-text">Hint: Try to see ALL wallet accounts, not just one...</p>
            </div>
          )}
        </div>

        {/* Success State */}
        {heistComplete && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="two-part-heist"
              flag={challenge?.flag}
              explanation="You combined two vulnerabilities: First, you used SQL injection to leak information about internal accounts (discovering the 'bank' account). Then, you exploited flawed transfer logic that didn't properly validate negative amounts, allowing you to credit yourself coins by 'transferring' negative amounts to the bank!"
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
                <Link to="/tutorial/two-part-heist">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
