import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Eye, EyeOff, Lightbulb, RefreshCw, Play, X, AlertTriangle, Code, FileWarning, ShieldCheck, Lock, Unlock } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './FixTheBugChallenge.css'

const FLAG = 'FLAG{d3f3nd3r_m0d3_4ct1v3}'

// Vulnerable code snippets that need fixing
const VULNERABILITIES = [
  {
    id: 'auth-bypass',
    title: 'Authentication Bypass',
    category: 'Access Control',
    description: 'The login function has a critical flaw that allows bypassing authentication.',
    vulnerableCode: `function authenticateUser(username, password) {
  const user = database.findUser(username);
  
  // Check if user exists and password matches
  if (user.password = password) {
    return { success: true, token: generateToken(user) };
  }
  
  return { success: false, error: 'Invalid credentials' };
}`,
    hint: 'Look carefully at the comparison operator. What does = do vs ==?',
    vulnerability: 'Using assignment (=) instead of comparison (== or ===) always evaluates to truthy'
  },
  {
    id: 'sql-injection',
    title: 'SQL Injection',
    category: 'Input Validation',
    description: 'This database query is vulnerable to SQL injection attacks.',
    vulnerableCode: `function getUserProfile(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  return database.execute(query);
}

// Called with: getUserProfile(req.params.id)`,
    hint: 'User input should never be directly concatenated into SQL queries.',
    vulnerability: 'String concatenation allows attackers to inject malicious SQL'
  },
  {
    id: 'path-traversal',
    title: 'Path Traversal',
    category: 'File Access',
    description: 'The file download function allows accessing files outside the intended directory.',
    vulnerableCode: `function downloadFile(filename) {
  const basePath = '/var/www/uploads/';
  const filePath = basePath + filename;
  
  // No validation - user can use ../
  return fs.readFileSync(filePath);
}

// Attacker uses: downloadFile('../../../etc/passwd')`,
    hint: 'The filename can contain special characters that navigate directories.',
    vulnerability: 'No validation allows ../ sequences to escape the uploads directory'
  }
]

export default function FixTheBugChallenge() {
  const { markCompleted, isCompleted } = useProgress()
  const [currentVuln, setCurrentVuln] = useState(0)
  const [userCode, setUserCode] = useState(VULNERABILITIES.map(v => v.vulnerableCode))
  const [testResults, setTestResults] = useState(VULNERABILITIES.map(() => null))
  const [allFixed, setAllFixed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  
  const challenge = getChallengeById('fix-the-bug')
  const alreadyCompleted = isCompleted('fix-the-bug')

  const hints = [
    'Each code snippet has exactly one vulnerability you need to fix.',
    'Read the description and think about what an attacker could exploit.',
    'For auth bypass: What operator should be used for comparison in JavaScript?',
    'For SQL injection: How can you safely pass user input to database queries?',
    'For path traversal: How can you ensure the path stays within the allowed directory?',
    'The hints under each snippet tell you what line to focus on.'
  ]

  const vuln = VULNERABILITIES[currentVuln]

  const runSecurityTest = (vulnIndex) => {
    const code = userCode[vulnIndex]
    const vulnerability = VULNERABILITIES[vulnIndex]
    
    let passed = false
    
    // Check if the fix was applied
    if (vulnerability.id === 'auth-bypass') {
      // Check for proper comparison operator (== or ===)
      passed = (code.includes('==') && !code.includes('= password')) || code.includes('===')
    } else if (vulnerability.id === 'sql-injection') {
      // Check for parameterized query
      passed = code.includes('?') && (code.includes('[userId]') || code.includes('userId]'))
    } else if (vulnerability.id === 'path-traversal') {
      // Check for path validation
      passed = code.includes('startsWith') || code.includes('resolve') || 
               code.includes('normalize') || (code.includes('../') && code.includes('Error'))
    }
    
    const newResults = [...testResults]
    newResults[vulnIndex] = passed
    setTestResults(newResults)
    
    // Check if all are fixed
    if (newResults.every(r => r === true)) {
      setAllFixed(true)
    }
    
    return passed
  }

  const runAllTests = () => {
    const results = VULNERABILITIES.map((_, i) => {
      const code = userCode[i]
      const vulnerability = VULNERABILITIES[i]
      
      let passed = false
      
      if (vulnerability.id === 'auth-bypass') {
        passed = (code.includes('==') && !code.includes('= password')) || code.includes('===')
      } else if (vulnerability.id === 'sql-injection') {
        passed = code.includes('?') && (code.includes('[userId]') || code.includes('userId]'))
      } else if (vulnerability.id === 'path-traversal') {
        passed = code.includes('startsWith') || code.includes('resolve') || 
                 code.includes('normalize') || (code.includes('../') && code.includes('Error'))
      }
      
      return passed
    })
    
    setTestResults(results)
    
    if (results.every(r => r === true)) {
      setAllFixed(true)
    }
  }

  const handleCodeChange = (value) => {
    const newCode = [...userCode]
    newCode[currentVuln] = value
    setUserCode(newCode)
    
    // Reset test result when code changes
    const newResults = [...testResults]
    newResults[currentVuln] = null
    setTestResults(newResults)
    setAllFixed(false)
  }

  const claimFlag = () => {
    markCompleted('fix-the-bug', FLAG)
    setShowSuccess(true)
  }

  const resetChallenge = () => {
    setUserCode(VULNERABILITIES.map(v => v.vulnerableCode))
    setTestResults(VULNERABILITIES.map(() => null))
    setAllFixed(false)
    setCurrentVuln(0)
  }

  if (showSuccess || alreadyCompleted) {
    return (
      <div className="challenge-container fix-the-bug">
        <div className="challenge-header">
          <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        </div>
        <SuccessScreen
          challengeId="fix-the-bug"
          flag={FLAG}
          explanation="You've proven your defensive security skills by identifying and fixing three common vulnerabilities: authentication bypass (= vs ==), SQL injection (parameterized queries), and path traversal (path validation). These are critical skills for secure software development!"
        />
      </div>
    )
  }

  return (
    <div className="challenge-container fix-the-bug">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Fix The Vulnerability'}</h1>
        <p className="challenge-description">Time to switch sides. As a security defender, find and fix the vulnerabilities in these code snippets.</p>
        
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
            You're a security engineer reviewing code before deployment. Each snippet has a 
            critical vulnerability that could be exploited by attackers.
          </p>
          <p>
            <strong>Objective:</strong> Fix all three vulnerabilities to secure the system and earn the flag.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="fix-progress-overview">
          <div className="progress-header">
            <h3>
              <FileWarning size={18} />
              Vulnerabilities to Fix
            </h3>
            <span className="progress-count">
              {testResults.filter(r => r === true).length} / {VULNERABILITIES.length} Fixed
            </span>
          </div>
          
          <div className="vuln-tabs">
            {VULNERABILITIES.map((v, i) => (
              <button
                key={v.id}
                className={`vuln-tab ${currentVuln === i ? 'active' : ''} ${testResults[i] === true ? 'fixed' : ''} ${testResults[i] === false ? 'failed' : ''}`}
                onClick={() => setCurrentVuln(i)}
              >
                <span className="tab-icon">
                  {testResults[i] === true ? <CheckCircle size={14} /> : 
                   testResults[i] === false ? <X size={14} /> : 
                   <AlertTriangle size={14} />}
                </span>
                {v.title}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="code-editor-section">
          <div className="editor-header">
            <div className="editor-title">
              <Code size={18} />
              <span>{vuln.title}</span>
              <span className="category-badge">{vuln.category}</span>
            </div>
            <button className="run-test-btn" onClick={() => runSecurityTest(currentVuln)}>
              <Play size={14} />
              Run Test
            </button>
          </div>
          
          <p className="vuln-description">{vuln.description}</p>
          
          <div className="code-container">
            <textarea
              className="code-textarea"
              value={userCode[currentVuln]}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck="false"
            />
            <div className="line-hint">
              <Lightbulb size={14} />
              Hint: {vuln.hint}
            </div>
          </div>

          {/* Test Result */}
          {testResults[currentVuln] !== null && (
            <div className={`test-result ${testResults[currentVuln] ? 'pass' : 'fail'}`}>
              {testResults[currentVuln] ? (
                <>
                  <Lock size={18} />
                  <div>
                    <strong>Secure!</strong>
                    <p>The vulnerability has been properly fixed.</p>
                  </div>
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  <div>
                    <strong>Still Vulnerable</strong>
                    <p>Original flaw: {vuln.vulnerability}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="fix-actions">
          <Button variant="ghost" onClick={resetChallenge}>
            <RefreshCw size={16} /> Reset All
          </Button>
          <Button variant="secondary" onClick={runAllTests}>
            <Play size={16} /> Run All Tests
          </Button>
          {allFixed && (
            <Button variant="primary" onClick={claimFlag}>
              <ShieldCheck size={16} /> Claim Flag
            </Button>
          )}
        </div>

        {/* All Fixed Message */}
        {allFixed && (
          <div className="all-fixed-banner">
            <ShieldCheck size={24} />
            <div>
              <strong>All Vulnerabilities Patched!</strong>
              <p>You've successfully secured all three code snippets. The system is now protected.</p>
            </div>
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
                <Link to="/tutorial/fix-the-bug">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
