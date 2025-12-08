import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Lock, Search, XCircle, EyeOff, Lightbulb } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import { generateFakeQuery, simulateLogin } from '../../utils/sqlSimulator'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import './SqlLoginChallenge.css'

export default function SqlLoginChallenge() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('sql-login')
  const alreadyCompleted = isCompleted('sql-login')

  const fakeQuery = generateFakeQuery(username, password)

  const handleSubmit = (e) => {
    e.preventDefault()
    const loginResult = simulateLogin(username, password)
    setResult(loginResult)
    
    if (loginResult.success && loginResult.injected) {
      markCompleted('sql-login')
    }
  }

  const handleReset = () => {
    setUsername('')
    setPassword('')
    setResult(null)
  }

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge.title}</h1>
        <p className="challenge-description">{challenge.description}</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge.estimatedTime}</span>
          <span className="meta-item difficulty">{challenge.difficulty}</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-scenario">
          <h2><Target size={18} /> Scenario</h2>
          <p>
            You've discovered a login portal for the fictional "HackMe Lab Admin System". 
            The developers made a critical mistake: they built their SQL query using string 
            concatenation instead of parameterized queries.
          </p>
          <p>
            Your mission: Bypass the authentication without knowing valid credentials.
          </p>
        </div>

        {/* The Fake Login Form */}
        <div className="login-panel">
          <div className="login-header">
            <span className="login-logo"><Lock size={24} /></span>
            <h3>HackMe Lab Admin Login</h3>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="off"
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">
                Login
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Backend Query Preview */}
        <div className="query-preview">
          <h3><Search size={18} /> Backend Query Preview</h3>
          <p className="query-note">
            This is what the (simulated) backend query looks like with your input:
          </p>
          <Terminal title="SQL Query">
            {fakeQuery}
          </Terminal>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`result-panel ${result.success ? 'success' : 'failure'}`}>
            {result.success ? (
              <SuccessScreen
                challengeId="sql-login"
                flag={challenge.flag}
                explanation="Your input manipulated the SQL query to always return true, bypassing the password check entirely. In a real system, this could give you access to any account!"
              />
            ) : (
              <div className="failure-message">
                <h3><XCircle size={18} /> Login Failed</h3>
                <p>{result.message}</p>
                <p className="hint-prompt">
                  Try thinking about how the SQL query is constructed...
                </p>
              </div>
            )}
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
              {hintIndex >= 1 && <p><strong>Hint 1:</strong> Look at how your input appears in the SQL query.</p>}
              {hintIndex >= 2 && <p><strong>Hint 2:</strong> What if you could "close" the string early with a single quote?</p>}
              {hintIndex >= 3 && <p><strong>Hint 3:</strong> The classic injection: <code>' OR '1'='1</code></p>}
              
              {hintIndex < 3 && (
                <button 
                  className="next-hint-btn"
                  onClick={() => setHintIndex(prev => prev + 1)}
                >
                  Next Hint
                </button>
              )}
              
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/sql-login">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
