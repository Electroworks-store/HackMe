import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, Eye, EyeOff, Lightbulb, RefreshCw, Play, X, AlertTriangle, Code, FileWarning, ShieldCheck, Lock, Unlock, Zap, Shield, Skull, ChevronRight } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './FixTheBugChallenge.css'

const FLAG = 'FLAG{d3f3nd3r_m0d3_4ct1v3}'

// Test scenarios for each vulnerability
const TEST_SCENARIOS = {
  'auth-bypass': {
    legitimate: [
      { name: 'Valid credentials', input: { username: 'alice', password: 'secret123' }, expected: 'success', description: 'Correct password should authenticate' },
      { name: 'Wrong password', input: { username: 'alice', password: 'wrongpass' }, expected: 'fail', description: 'Invalid password should be rejected' },
    ],
    attacks: [
      { name: 'Empty password bypass', input: { username: 'admin', password: '' }, expected: 'block', description: 'Empty string should not grant access', exploit: "// Attacker sends empty password\nlogin('admin', '')  // Should fail!" },
      { name: 'Truthy assignment bypass', input: { username: 'admin', password: 'anything' }, expected: 'block', description: 'Assignment operator (=) always returns truthy', exploit: "// Bug: (user.password = password) always truthy\nif (user.password = 'anything') // = assigns, doesn't compare!" },
    ]
  },
  'sql-injection': {
    legitimate: [
      { name: 'Normal user lookup', input: { userId: '42' }, expected: 'success', description: 'Valid numeric ID should work' },
      { name: 'Another valid ID', input: { userId: '1' }, expected: 'success', description: 'Single digit ID lookup' },
    ],
    attacks: [
      { name: 'SQL union injection', input: { userId: "1 UNION SELECT * FROM passwords--" }, expected: 'block', description: 'Union attack to extract other tables', exploit: "// Attacker input:\ngetUserProfile(\"1 UNION SELECT * FROM passwords--\")\n// Executes: SELECT * FROM users WHERE id = 1 UNION SELECT * FROM passwords--" },
      { name: 'SQL delete injection', input: { userId: "1; DROP TABLE users;--" }, expected: 'block', description: 'Destructive SQL injection', exploit: "// Attacker input:\ngetUserProfile(\"1; DROP TABLE users;--\")\n// Executes: SELECT * FROM users WHERE id = 1; DROP TABLE users;--" },
    ]
  },
  'path-traversal': {
    legitimate: [
      { name: 'Valid file download', input: { filename: 'report.pdf' }, expected: 'success', description: 'Normal filename should work' },
      { name: 'Nested directory', input: { filename: 'docs/manual.txt' }, expected: 'success', description: 'Subdirectory access is allowed' },
    ],
    attacks: [
      { name: 'Parent directory escape', input: { filename: '../../../etc/passwd' }, expected: 'block', description: 'Escape uploads to read system files', exploit: "// Attacker request:\ndownloadFile('../../../etc/passwd')\n// Resolves to: /etc/passwd  (system file!)" },
      { name: 'Double encoding bypass', input: { filename: '..%2F..%2F..%2Fetc/shadow' }, expected: 'block', description: 'URL encoded path traversal', exploit: "// Attacker uses URL encoding:\ndownloadFile('..%2F..%2Fetc/shadow')\n// Some servers decode %2F to / allowing escape" },
    ]
  }
}

// Advanced test scenarios (Stage 2) - more subtle edge cases
const ADVANCED_SCENARIOS = {
  'auth-bypass': {
    name: 'Timing Attack Check',
    description: 'Advanced: Does your fix prevent timing-based attacks?',
    attacks: [
      { name: 'Null user check', description: 'What if the user does not exist at all?', check: 'user' },
      { name: 'Type coercion', description: 'Using == instead of === allows type coercion attacks', check: 'strict' },
    ]
  },
  'sql-injection': {
    name: 'Blind Injection Check', 
    description: 'Advanced: Does your fix handle all injection variants?',
    attacks: [
      { name: 'Numeric validation', description: 'Did you validate userId is actually numeric?', check: 'numeric' },
      { name: 'Array parameter', description: 'What if userId is passed as an array?', check: 'array' },
    ]
  },
  'path-traversal': {
    name: 'Bypass Techniques',
    description: 'Advanced: Does your fix handle encoding bypasses?',
    attacks: [
      { name: 'Null byte injection', description: 'Attackers can use null bytes: file.txt%00.jpg', check: 'null' },
      { name: 'Absolute path', description: 'What about absolute paths starting with /?', check: 'absolute' },
    ]
  }
}

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
  // Test harness state
  const [showTestHarness, setShowTestHarness] = useState(false)
  const [scenarioResults, setScenarioResults] = useState({})
  const [selectedExploit, setSelectedExploit] = useState(null)
  // Stage 2: Advanced tests
  const [stage, setStage] = useState(1)
  const [advancedResults, setAdvancedResults] = useState(VULNERABILITIES.map(() => null))
  const [allAdvancedPassed, setAllAdvancedPassed] = useState(false)
  
  const challenge = getChallengeById('fix-the-bug')
  const alreadyCompleted = isCompleted('fix-the-bug')

  const hints = [
    'Each code snippet has exactly one vulnerability you need to fix.',
    'Read the description and think about what an attacker could exploit.',
    'Try the Test Harness to see exactly how attacks exploit the vulnerability.',
    'For auth bypass: What operator should be used for comparison in JavaScript?',
    'For SQL injection: How can you safely pass user input to database queries?',
    'For path traversal: How can you ensure the path stays within the allowed directory?',
    'Stage 2 - Auth: Always check if user exists before comparing passwords. Use === for strict equality.',
    'Stage 2 - SQL: Validate that userId is numeric. Consider using parseInt or a regex check.',
    'Stage 2 - Path: Check for null bytes and absolute paths. Normalize the path before validation.',
  ]

  const vuln = VULNERABILITIES[currentVuln]
  const scenarios = TEST_SCENARIOS[vuln.id]
  const advancedScenario = ADVANCED_SCENARIOS[vuln.id]

  // Run advanced security tests (Stage 2)
  const runAdvancedTest = (vulnIndex) => {
    const code = userCode[vulnIndex]
    const vulnId = VULNERABILITIES[vulnIndex].id
    let passed = false
    
    if (vulnId === 'auth-bypass') {
      // Check for: user existence check AND strict equality
      const hasUserCheck = code.includes('!user') || code.includes('user &&') || code.includes('if (user)') || code.includes('user ?')
      const hasStrictEquality = code.includes('===')
      passed = hasUserCheck && hasStrictEquality
    } else if (vulnId === 'sql-injection') {
      // Check for: parameterized query AND numeric validation
      const hasParams = code.includes('?') && (code.includes('[userId]') || code.includes('userId]'))
      const hasNumericCheck = code.includes('parseInt') || code.includes('Number(') || code.includes('/^\\d+$/') || code.includes('isNaN')
      passed = hasParams && hasNumericCheck
    } else if (vulnId === 'path-traversal') {
      // Check for: path validation AND null byte / absolute path handling
      const hasPathValidation = code.includes('startsWith') || code.includes('resolve')
      const hasNullCheck = code.includes('\\x00') || code.includes('\\0') || code.includes('%00') || code.includes('null')
      const hasAbsoluteCheck = code.includes('startsWith(\'/\')') || code.includes('startsWith("/")') || code.includes('/^\\//')
      passed = hasPathValidation && (hasNullCheck || hasAbsoluteCheck)
    }
    
    const newResults = [...advancedResults]
    newResults[vulnIndex] = passed
    setAdvancedResults(newResults)
    
    // Check if all advanced tests pass
    if (newResults.every(r => r === true)) {
      setAllAdvancedPassed(true)
    }
    
    return passed
  }

  const runAllAdvancedTests = () => {
    const results = VULNERABILITIES.map((_, i) => {
      const code = userCode[i]
      const vulnId = VULNERABILITIES[i].id
      let passed = false
      
      if (vulnId === 'auth-bypass') {
        const hasUserCheck = code.includes('!user') || code.includes('user &&') || code.includes('if (user)') || code.includes('user ?')
        const hasStrictEquality = code.includes('===')
        passed = hasUserCheck && hasStrictEquality
      } else if (vulnId === 'sql-injection') {
        const hasParams = code.includes('?') && (code.includes('[userId]') || code.includes('userId]'))
        const hasNumericCheck = code.includes('parseInt') || code.includes('Number(') || code.includes('/^\\d+$/') || code.includes('isNaN')
        passed = hasParams && hasNumericCheck
      } else if (vulnId === 'path-traversal') {
        const hasPathValidation = code.includes('startsWith') || code.includes('resolve')
        const hasNullCheck = code.includes('\\x00') || code.includes('\\0') || code.includes('%00') || code.includes('null')
        const hasAbsoluteCheck = code.includes('startsWith(\'/\')') || code.includes('startsWith("/")') || code.includes('/^\\//')
        passed = hasPathValidation && (hasNullCheck || hasAbsoluteCheck)
      }
      
      return passed
    })
    
    setAdvancedResults(results)
    if (results.every(r => r === true)) {
      setAllAdvancedPassed(true)
    }
  }

  // Run test harness scenarios
  const runTestHarness = () => {
    const code = userCode[currentVuln]
    const vulnId = vuln.id
    const results = {}
    
    // Check if the code is fixed
    let isFixed = false
    if (vulnId === 'auth-bypass') {
      isFixed = (code.includes('==') && !code.includes('= password')) || code.includes('===')
    } else if (vulnId === 'sql-injection') {
      isFixed = code.includes('?') && (code.includes('[userId]') || code.includes('userId]'))
    } else if (vulnId === 'path-traversal') {
      isFixed = code.includes('startsWith') || code.includes('resolve') || 
                code.includes('normalize') || (code.includes('../') && code.includes('Error'))
    }
    
    // Legitimate tests should pass regardless
    scenarios.legitimate.forEach((scenario, i) => {
      results[`leg-${i}`] = { passed: true, type: 'legitimate' }
    })
    
    // Attack tests: blocked if fixed, exploited if not
    scenarios.attacks.forEach((scenario, i) => {
      results[`atk-${i}`] = { 
        passed: isFixed, // Attack blocked = pass
        type: 'attack',
        blocked: isFixed
      }
    })
    
    setScenarioResults(results)
  }

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
    
    // Also reset advanced results
    const newAdvanced = [...advancedResults]
    newAdvanced[currentVuln] = null
    setAdvancedResults(newAdvanced)
    setAllAdvancedPassed(false)
  }

  const unlockStage2 = () => {
    setStage(2)
  }

  const claimFlag = () => {
    markCompleted('fix-the-bug', FLAG)
    setShowSuccess(true)
  }

  const resetChallenge = () => {
    setUserCode(VULNERABILITIES.map(v => v.vulnerableCode))
    setTestResults(VULNERABILITIES.map(() => null))
    setAdvancedResults(VULNERABILITIES.map(() => null))
    setAllFixed(false)
    setAllAdvancedPassed(false)
    setStage(1)
    setCurrentVuln(0)
    setShowSuccess(false)
  }

  if (showSuccess) {
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
        <div className="try-again-section">
          <Button variant="secondary" onClick={resetChallenge}>
            <RefreshCw size={16} /> Try Again
          </Button>
        </div>
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

        {/* Test Harness */}
        <div className="test-harness-section">
          <button 
            className="harness-toggle"
            onClick={() => setShowTestHarness(!showTestHarness)}
          >
            <Zap size={16} />
            {showTestHarness ? 'Hide Test Harness' : 'Show Test Harness'}
          </button>
          
          {showTestHarness && (
            <div className="test-harness">
              <div className="harness-header">
                <h4>Attack Simulation</h4>
                <button className="run-harness-btn" onClick={runTestHarness}>
                  <Play size={14} /> Run All Scenarios
                </button>
              </div>
              
              <div className="scenario-matrix">
                {/* Legitimate Requests */}
                <div className="scenario-group">
                  <div className="group-header">
                    <Shield size={16} />
                    <span>Legitimate Requests</span>
                  </div>
                  {scenarios.legitimate.map((scenario, i) => (
                    <div 
                      key={`leg-${i}`}
                      className={`scenario-row ${scenarioResults[`leg-${i}`]?.passed ? 'passed' : ''}`}
                    >
                      <span className="scenario-name">{scenario.name}</span>
                      <span className="scenario-desc">{scenario.description}</span>
                      <span className="scenario-result">
                        {scenarioResults[`leg-${i}`] ? (
                          <><CheckCircle size={14} /> OK</>
                        ) : (
                          <span className="pending">-</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Attack Scenarios */}
                <div className="scenario-group attacks">
                  <div className="group-header">
                    <Skull size={16} />
                    <span>Attack Scenarios</span>
                  </div>
                  {scenarios.attacks.map((scenario, i) => (
                    <div 
                      key={`atk-${i}`}
                      className={`scenario-row ${scenarioResults[`atk-${i}`]?.blocked ? 'blocked' : scenarioResults[`atk-${i}`] ? 'exploited' : ''}`}
                      onClick={() => setSelectedExploit(selectedExploit === i ? null : i)}
                    >
                      <span className="scenario-name">{scenario.name}</span>
                      <span className="scenario-desc">{scenario.description}</span>
                      <span className="scenario-result">
                        {scenarioResults[`atk-${i}`] ? (
                          scenarioResults[`atk-${i}`].blocked ? (
                            <><Shield size={14} /> BLOCKED</>
                          ) : (
                            <><AlertTriangle size={14} /> EXPLOITED</>
                          )
                        ) : (
                          <span className="pending">-</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Exploit Preview */}
              {selectedExploit !== null && (
                <div className="exploit-preview">
                  <div className="exploit-header">
                    <Skull size={16} />
                    <span>Exploit Preview: {scenarios.attacks[selectedExploit].name}</span>
                    <button onClick={() => setSelectedExploit(null)}>
                      <X size={14} />
                    </button>
                  </div>
                  <pre className="exploit-code">
                    {scenarios.attacks[selectedExploit].exploit}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="fix-actions">
          <Button variant="ghost" onClick={resetChallenge}>
            <RefreshCw size={16} /> Reset All
          </Button>
          {stage === 1 ? (
            <>
              <Button variant="secondary" onClick={runAllTests}>
                <Play size={16} /> Run All Tests
              </Button>
              {allFixed && (
                <Button variant="primary" onClick={unlockStage2}>
                  <ChevronRight size={16} /> Unlock Advanced Mode
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={runAllAdvancedTests}>
                <Zap size={16} /> Run Advanced Tests
              </Button>
              {allAdvancedPassed && (
                <Button variant="primary" onClick={claimFlag}>
                  <ShieldCheck size={16} /> Claim Flag
                </Button>
              )}
            </>
          )}
        </div>

        {/* Stage 1: All Fixed Message */}
        {allFixed && stage === 1 && (
          <div className="all-fixed-banner">
            <ShieldCheck size={24} />
            <div>
              <strong>Stage 1 Complete: Basic Vulnerabilities Patched</strong>
              <p>Good work! But a sophisticated attacker may still find edge cases. Unlock Advanced Mode to harden your fixes further.</p>
            </div>
          </div>
        )}

        {/* Stage 2: Advanced Tests Section */}
        {stage === 2 && (
          <div className="advanced-tests-section">
            <div className="advanced-header">
              <h3>
                <Zap size={18} />
                Stage 2: Advanced Security Tests
              </h3>
              <span className="advanced-count">
                {advancedResults.filter(r => r === true).length} / {VULNERABILITIES.length} Hardened
              </span>
            </div>
            
            <p className="advanced-intro">
              Your basic fixes work, but sophisticated attackers exploit edge cases. 
              Strengthen your code to handle these advanced scenarios.
            </p>

            <div className="advanced-tests-list">
              {VULNERABILITIES.map((v, i) => (
                <div key={v.id} className={`advanced-test-card ${advancedResults[i] === true ? 'passed' : advancedResults[i] === false ? 'failed' : ''}`}>
                  <div className="advanced-test-header">
                    <span className="advanced-test-name">{v.title}</span>
                    <span className="advanced-test-status">
                      {advancedResults[i] === true ? <><CheckCircle size={14} /> Hardened</> :
                       advancedResults[i] === false ? <><X size={14} /> Vulnerable</> :
                       <span className="pending">Not tested</span>}
                    </span>
                  </div>
                  <div className="advanced-test-desc">
                    <strong>{ADVANCED_SCENARIOS[v.id].name}</strong>
                    <p>{ADVANCED_SCENARIOS[v.id].description}</p>
                  </div>
                  <div className="advanced-checks">
                    {ADVANCED_SCENARIOS[v.id].attacks.map((atk, j) => (
                      <div key={j} className="advanced-check-item">
                        <AlertTriangle size={12} />
                        <span>{atk.description}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="advanced-test-btn"
                    onClick={() => {
                      setCurrentVuln(i)
                      runAdvancedTest(i)
                    }}
                  >
                    <Play size={14} /> Test {v.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2: All Advanced Passed */}
        {allAdvancedPassed && stage === 2 && (
          <div className="all-fixed-banner advanced">
            <ShieldCheck size={24} />
            <div>
              <strong>Stage 2 Complete: All Defenses Hardened</strong>
              <p>Excellent! Your code now handles both common attacks and sophisticated edge cases.</p>
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
