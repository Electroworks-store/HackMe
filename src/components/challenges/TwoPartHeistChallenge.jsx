import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Database, Search, Send, Wallet, AlertTriangle, Lightbulb, EyeOff, RefreshCw, TrendingUp, Shield } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './TwoPartHeistChallenge.css'

// Fake wallet database with more accounts
const WALLET_DATABASE = [
  { username: 'you', coins: 50, notes: 'New user account', type: 'user' },
  { username: 'alice', coins: 150, notes: 'Regular user', type: 'user' },
  { username: 'bob', coins: 1000, notes: 'Premium member', type: 'user' },
  { username: 'bank', coins: 99999, notes: 'Main liquidity pool', type: 'system' },
  { username: 'fees', coins: 25000, notes: 'Fee collection account - 2% rebate on refunds', type: 'system' },
]

// System constants
const TRANSFER_LIMIT = 100  // Normal users limited to 100 per transfer
const FEE_PERCENT = 2       // 2% fee on transfers
const REBATE_MULTIPLIER = 2 // Bug: refunds from fees are doubled!

export default function TwoPartHeistChallenge() {
  const [queryInput, setQueryInput] = useState('')
  const [queryResults, setQueryResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  
  // Transfer state
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [yourBalance, setYourBalance] = useState(50)
  const [feeBalance, setFeeBalance] = useState(25000)
  const [transferLog, setTransferLog] = useState([])
  const [transferError, setTransferError] = useState('')
  const [feesCollected, setFeesCollected] = useState(0)
  
  // Challenge progress
  const [discoveredAccounts, setDiscoveredAccounts] = useState(false)
  const [discoveredFeeExploit, setDiscoveredFeeExploit] = useState(false)
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
      setDiscoveredAccounts(true)
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

  // Handle transfer with complex logic
  const handleTransfer = (e) => {
    e.preventDefault()
    setTransferError('')
    
    const to = transferTo.trim().toLowerCase()
    const amount = parseInt(transferAmount, 10)
    const timestamp = new Date().toLocaleTimeString()

    if (!to) {
      setTransferError('Please specify a recipient.')
      return
    }

    if (isNaN(amount) || amount === 0) {
      setTransferError('Please enter a valid amount.')
      return
    }

    // EXPLOIT 1: Negative transfer to "fees" account triggers rebate bug
    if (to === 'fees' && amount < 0) {
      // Bug: Negative transfers to fees are treated as "refund requests"
      // AND they're doubled due to REBATE_MULTIPLIER bug!
      const refundAmount = Math.abs(amount) * REBATE_MULTIPLIER
      
      if (refundAmount <= feeBalance) {
        setYourBalance(prev => prev + refundAmount)
        setFeeBalance(prev => prev - refundAmount)
        setDiscoveredFeeExploit(true)
        
        setTransferLog(prev => [...prev, {
          time: timestamp,
          type: 'exploit',
          message: `🔓 REFUND BUG: Requested ${amount} refund from fees → Received ${refundAmount} coins (2x multiplier)!`
        }])
        
        if (yourBalance + refundAmount >= 50000) {
          setHeistComplete(true)
          markCompleted('two-part-heist')
        }
        return
      } else {
        setTransferError('Fees account has insufficient balance for this refund.')
        return
      }
    }

    // EXPLOIT 2: Negative transfer to "bank" still works but with limit bypass
    if (to === 'bank' && amount < 0) {
      const gained = Math.abs(amount)
      // Bank transfers bypass the normal limit but apply fee!
      const fee = Math.floor(gained * FEE_PERCENT / 100)
      const netGain = gained - fee
      
      setYourBalance(prev => prev + netGain)
      setFeeBalance(prev => prev + fee)
      setFeesCollected(prev => prev + fee)
      
      setTransferLog(prev => [...prev, {
        time: timestamp,
        type: 'exploit',
        message: `💰 BANK EXPLOIT: Transferred ${amount} to bank → Gained ${netGain} coins (${fee} fee collected)`
      }])
      
      if (yourBalance + netGain >= 50000) {
        setHeistComplete(true)
        markCompleted('two-part-heist')
      }
      return
    }

    // Normal transfer validation
    if (amount < 0) {
      setTransferError('❌ Security: Negative transfers not allowed for regular accounts.')
      return
    }

    // Transfer limit for normal accounts
    if (amount > TRANSFER_LIMIT && to !== 'bank' && to !== 'fees') {
      setTransferError(`❌ Transfer limit: Maximum ${TRANSFER_LIMIT} coins per transaction for user accounts.`)
      setTransferLog(prev => [...prev, {
        time: timestamp,
        type: 'error',
        message: `❌ Blocked: ${amount} exceeds limit of ${TRANSFER_LIMIT} per transfer`
      }])
      return
    }

    if (amount > yourBalance) {
      setTransferError(`❌ Insufficient funds. You have ${yourBalance} coins.`)
      setTransferLog(prev => [...prev, {
        time: timestamp,
        type: 'error',
        message: `❌ Failed: Tried to send ${amount} coins (balance: ${yourBalance})`
      }])
      return
    }

    // Calculate fee for normal transfers
    const fee = Math.floor(amount * FEE_PERCENT / 100)
    const netAmount = amount - fee

    // Valid transfer
    setYourBalance(prev => prev - amount)
    setFeeBalance(prev => prev + fee)
    setFeesCollected(prev => prev + fee)
    
    setTransferLog(prev => [...prev, {
      time: timestamp,
      type: 'success',
      message: `✓ Sent ${netAmount} coins to ${to} (${fee} coin fee deducted)`
    }])
    setTransferAmount('')
  }

  // Reset challenge
  const handleReset = () => {
    setQueryInput('')
    setQueryResults(null)
    setTransferTo('')
    setTransferAmount('')
    setYourBalance(50)
    setFeeBalance(25000)
    setTransferLog([])
    setTransferError('')
    setFeesCollected(0)
    setDiscoveredAccounts(false)
    setDiscoveredFeeExploit(false)
    setHeistComplete(false)
  }

  const hints = [
    'Stage 1: The query box is vulnerable. Try SQL injection like: \' OR \'1\'=\'1',
    'Notice there are TWO system accounts: "bank" and "fees". Read their notes carefully!',
    'The "fees" account mentions "2% rebate on refunds". What if you request a refund?',
    'Try transferring NEGATIVE amounts to system accounts. Each behaves differently...',
    'The fees account has a bug: negative transfers trigger a 2x rebate! Try -10000 to fees.',
    'For maximum efficiency: Transfer to bank gives coins minus 2% fee. Fees account doubles your "refund"!'
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
            You've infiltrated HackMe Bank's internal wallet system. Your starting balance 
            is <strong>50 coins</strong>. Your mission: accumulate <strong>50,000+ coins</strong>.
          </p>
          <p>
            The system has multiple accounts and a complex transfer mechanism with fees. 
            There are transfer limits for security, but rumors say the internal accounts 
            have some... interesting bugs in their refund logic.
          </p>
          <div className="rules-box">
            <h4><Shield size={16} /> System Rules:</h4>
            <ul>
              <li>Transfer limit: {TRANSFER_LIMIT} coins per transaction (user accounts)</li>
              <li>All transfers incur a {FEE_PERCENT}% fee</li>
              <li>System accounts (bank, fees) have special handling</li>
            </ul>
          </div>
        </div>

        {/* Stage Progress Indicator */}
        <div className="stage-progress">
          <div className={`stage-indicator ${queryResults?.injected ? 'complete' : ''}`}>
            <span className="stage-num">1</span>
            <span className="stage-label">Recon</span>
            {queryResults?.injected && <CheckCircle size={14} className="stage-check" />}
          </div>
          <div className="stage-connector"></div>
          <div className={`stage-indicator ${discoveredFeeExploit ? 'complete' : discoveredAccounts ? 'active' : ''}`}>
            <span className="stage-num">2</span>
            <span className="stage-label">Exploit</span>
            {discoveredFeeExploit && <CheckCircle size={14} className="stage-check" />}
          </div>
          <div className="stage-connector"></div>
          <div className={`stage-indicator ${heistComplete ? 'complete' : ''}`}>
            <span className="stage-num">3</span>
            <span className="stage-label">Profit</span>
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
        <div className={`transfer-panel ${discoveredAccounts ? 'active' : 'locked'}`}>
          <div className="panel-header">
            <Send size={20} />
            <h3>Stage 2: Coin Transfer</h3>
            {!discoveredAccounts && <span className="locked-badge">🔒 Complete Stage 1</span>}
          </div>

          {discoveredAccounts ? (
            <>
              <div className="balance-display-row">
                <div className="balance-item">
                  <Wallet size={18} />
                  <span>Your Balance: <strong className={yourBalance >= 50000 ? 'rich' : ''}>{yourBalance.toLocaleString()} coins</strong></span>
                </div>
                <div className="balance-item fees-balance">
                  <TrendingUp size={18} />
                  <span>Fees Pool: <strong>{feeBalance.toLocaleString()} coins</strong></span>
                </div>
                {feesCollected > 0 && (
                  <div className="balance-item">
                    <span className="fees-note">({feesCollected} collected this session)</span>
                  </div>
                )}
              </div>
              
              {yourBalance >= 50000 && !heistComplete && (
                <div className="goal-reached">
                  <CheckCircle size={18} />
                  <span>Goal reached! You have 50,000+ coins!</span>
                </div>
              )}

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
                      placeholder="alice, bob, bank, fees..."
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
                    <RefreshCw size={16} /> Reset
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
              <p className="hint-text">Hint: The query box is vulnerable to injection attacks...</p>
            </div>
          )}
        </div>

        {/* Success State */}
        {heistComplete && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="two-part-heist"
              flag={challenge?.flag}
              explanation="You chained multiple vulnerabilities: 1) SQL injection revealed internal accounts including 'bank' and 'fees'. 2) You discovered that negative transfers to system accounts bypass validation. 3) The 'fees' account has a critical bug - refund requests (negative transfers) are doubled! This combination allowed you to drain the fee pool and become rich."
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
