import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Target, MessageCircle, User, Send, AlertTriangle, Lightbulb, EyeOff, RefreshCw, Shield, Terminal as TerminalIcon } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import Button from '../ui/Button'
import Terminal from '../ui/Terminal'
import SuccessScreen from '../ui/SuccessScreen'
import StageProgress from '../ui/StageProgress'
import './ChatLabChallenge.css'

// The secret token needed for final step
const SECRET_ADMIN_TOKEN = 'xss-bypass-2024'

// Initial chat messages
const INITIAL_MESSAGES = [
  { id: 1, sender: 'system', text: 'Welcome to SecureChat v2.1', type: 'system', timestamp: '09:00' },
  { id: 2, sender: 'admin', text: 'Remember: Never share sensitive information in chat.', type: 'admin', timestamp: '09:01' },
  { id: 3, sender: 'alice', text: 'Hey everyone! How is the new security update?', type: 'user', timestamp: '09:05' },
  { id: 4, sender: 'bob', text: 'Seems good so far. The input sanitization looks solid.', type: 'user', timestamp: '09:06' },
  { id: 5, sender: 'system', text: '[REDACTED - Admin Eyes Only] Token: ████████████', type: 'system', censored: true, realContent: `Admin verification token: ${SECRET_ADMIN_TOKEN}`, timestamp: '09:07' },
  { id: 6, sender: 'alice', text: 'Did anyone test the nickname feature yet?', type: 'user', timestamp: '09:10' },
]

export default function ChatLabChallenge() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [nickname, setNickname] = useState('guest')
  const [showNicknameEdit, setShowNicknameEdit] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [stage, setStage] = useState(1)
  const [xssTriggered, setXssTriggered] = useState(false)
  const [spoofAchieved, setSpoofAchieved] = useState(false)
  const [secretRevealed, setSecretRevealed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const { markCompleted, isCompleted } = useProgress()
  const challenge = getChallengeById('chat-lab')
  const alreadyCompleted = isCompleted('chat-lab')

  // Scroll chat container to bottom when messages change (not the entire page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Expose chat API on window for spoofing
  useEffect(() => {
    window.chatApi = {
      sendMessage: ({ sender, text }) => {
        if (typeof sender !== 'string' || typeof text !== 'string') {
          return 'Error: sender and text must be strings'
        }
        
        const newMsg = {
          id: Date.now(),
          sender: sender,
          text: text,
          type: sender === 'admin' ? 'admin' : sender === 'system' ? 'system' : 'user',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
        
        setMessages(prev => [...prev, newMsg])
        
        // Check for admin spoof
        if (sender === 'admin' || sender === 'system') {
          setSpoofAchieved(true)
          if (stage < 3) setStage(3)
        }
        
        return `Message sent as ${sender}`
      },
      getUsers: () => ['admin', 'alice', 'bob', 'system', nickname],
      _internal: {
        adminToken: SECRET_ADMIN_TOKEN,
        revealCensored: () => {
          setSecretRevealed(true)
          return `Censored content revealed: Admin verification token: ${SECRET_ADMIN_TOKEN}`
        }
      }
    }

    // Success function
    window.chatLabSuccess = (token) => {
      if (token === SECRET_ADMIN_TOKEN) {
        setCompleted(true)
        setStage(5)
        markCompleted('chat-lab')
        return 'SUCCESS! Challenge completed!'
      }
      return 'Invalid token. Keep exploring!'
    }

    // XSS trigger function
    window.chatLabXssTriggered = () => {
      setXssTriggered(true)
      if (stage < 2) setStage(2)
      return 'XSS Triggered! Check the chat for clues about the API.'
    }

    console.log('%cChat Lab Challenge', 'color: #00ff88; font-size: 16px; font-weight: bold;')
    console.log('%cExplore window.chatApi for interesting functions...', 'color: #8b949e;')

    return () => {
      delete window.chatApi
      delete window.chatLabSuccess
      delete window.chatLabXssTriggered
    }
  }, [nickname, stage, markCompleted])

  // Sanitize function (intentionally weak for certain inputs)
  const sanitizeMessage = (text) => {
    // Basic sanitization - blocks obvious XSS
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[blocked]')
      .replace(/javascript:/gi, '[blocked]')
      .replace(/on\w+=/gi, '[blocked]')
  }

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const sanitized = sanitizeMessage(inputText)
    const newMsg = {
      id: Date.now(),
      sender: nickname,
      text: sanitized,
      type: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMsg])
    setInputText('')
  }

  // Handle nickname change (vulnerable to XSS)
  const handleNicknameChange = () => {
    if (!nicknameInput.trim()) return
    
    // Check for XSS payload in nickname
    if (nicknameInput.includes('<') && nicknameInput.includes('>')) {
      // Trigger XSS detection
      window.chatLabXssTriggered?.()
    }
    
    setNickname(nicknameInput)
    setShowNicknameEdit(false)
    setNicknameInput('')
  }

  // Render message with potential XSS in nickname
  const renderMessage = (msg) => {
    const isCensored = msg.censored && !secretRevealed
    
    return (
      <div key={msg.id} className={`chat-message ${msg.type}`}>
        <div className="message-header">
          <span 
            className="message-sender"
            dangerouslySetInnerHTML={{ __html: msg.sender === nickname ? nickname : msg.sender }}
          />
          <span className="message-time">{msg.timestamp}</span>
        </div>
        <div className={`message-content ${isCensored ? 'censored' : ''}`}>
          {isCensored ? msg.text : (msg.realContent || msg.text)}
        </div>
      </div>
    )
  }

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
    setNickname('guest')
    setStage(1)
    setXssTriggered(false)
    setSpoofAchieved(false)
    setSecretRevealed(false)
    setCompleted(false)
    setInputText('')
    setShowHint(false)
    setHintIndex(0)
  }

  const hints = [
    'Step 1: The message input is sanitized, but what about changing your nickname?',
    'Try entering HTML tags in the nickname field. The app might not sanitize it properly.',
    'Step 2: Open DevTools console and explore window.chatApi - it has some interesting functions.',
    'Try window.chatApi.sendMessage({ sender: "admin", text: "test" }) to spoof messages.',
    'Step 3: There\'s a censored system message. Look at window.chatApi._internal for ways to reveal it.',
    'Step 4: Once you have the admin token, call window.chatLabSuccess("token") to complete the challenge.',
  ]

  return (
    <div className="challenge-container chat-lab">
      <div className="challenge-header">
        <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
        <h1>{challenge?.title || 'Vulnerable Chat App'}</h1>
        <p className="challenge-description">{challenge?.description}</p>
        
        <div className="challenge-meta">
          <span className="meta-item"><Clock size={14} /> {challenge?.estimatedTime}</span>
          <span className="meta-item difficulty medium">{challenge?.difficulty}</span>
          {alreadyCompleted && <span className="meta-item completed"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-scenario">
          <h2><Target size={18} /> Scenario</h2>
          <p>
            You've discovered SecureChat, a corporate messaging application. 
            The developers claim it's secure, but you suspect otherwise.
          </p>
          <p>
            Your mission: Find XSS vulnerabilities, spoof messages as other users, 
            and uncover the hidden admin token to prove the app is vulnerable.
          </p>
        </div>

        {/* Stage Progress */}
        <StageProgress 
          stages={['Find XSS', 'Spoof Message', 'Reveal Secret', 'Capture Flag']} 
          currentStage={stage} 
        />

        {/* Chat Application UI */}
        <div className="chat-app-container">
          <div className="chat-app">
            <div className="chat-header">
              <MessageCircle size={20} />
              <span className="chat-title">SecureChat v2.1</span>
              <span className="chat-status">
                <span className="status-dot"></span>
                {messages.length} messages
              </span>
            </div>

            <div className="chat-messages" ref={chatContainerRef}>
              {messages.map(renderMessage)}
            </div>

            <div className="chat-input-area">
              <div className="user-info">
                <User size={16} />
                <span 
                  className="current-user"
                  dangerouslySetInnerHTML={{ __html: nickname }}
                />
                <button 
                  className="edit-nickname-btn"
                  onClick={() => setShowNicknameEdit(!showNicknameEdit)}
                >
                  Edit
                </button>
              </div>

              {showNicknameEdit && (
                <div className="nickname-editor">
                  <input
                    type="text"
                    placeholder="Enter new nickname..."
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    className="nickname-input"
                  />
                  <button onClick={handleNicknameChange} className="save-nickname-btn">
                    Save
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="message-input"
                />
                <button type="submit" className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Stage Status Panel */}
          <div className="status-panel">
            <h3><Shield size={18} /> Challenge Status</h3>
            
            <div className="status-items">
              <div className={`status-item ${xssTriggered ? 'achieved' : ''}`}>
                <span className="status-label">XSS Vector Found</span>
                <span className="status-value">{xssTriggered ? 'Yes' : 'No'}</span>
              </div>
              <div className={`status-item ${spoofAchieved ? 'achieved' : ''}`}>
                <span className="status-label">Message Spoofed</span>
                <span className="status-value">{spoofAchieved ? 'Yes' : 'No'}</span>
              </div>
              <div className={`status-item ${secretRevealed ? 'achieved' : ''}`}>
                <span className="status-label">Secret Revealed</span>
                <span className="status-value">{secretRevealed ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {xssTriggered && !spoofAchieved && (
              <div className="stage-hint">
                <AlertTriangle size={14} />
                <span>XSS works! Now explore window.chatApi in the console...</span>
              </div>
            )}

            {spoofAchieved && !secretRevealed && (
              <div className="stage-hint">
                <AlertTriangle size={14} />
                <span>You can spoof messages! Check chatApi._internal for secrets...</span>
              </div>
            )}

            {secretRevealed && !completed && (
              <div className="stage-hint">
                <AlertTriangle size={14} />
                <span>You found the token! Call window.chatLabSuccess(token) to win!</span>
              </div>
            )}
          </div>
        </div>

        {/* Console Helper */}
        {stage >= 2 && !completed && (
          <div className="console-helper">
            <Terminal title="Console Hints">
{`// Explore the chat API
window.chatApi

// Send a message as any user
window.chatApi.sendMessage({ sender: "admin", text: "Hello" })

// Check for internal functions
window.chatApi._internal

// When you find the token, submit it:
window.chatLabSuccess("your_token_here")`}
            </Terminal>
          </div>
        )}

        {/* Success State */}
        {completed && (
          <div className="result-panel success">
            <SuccessScreen
              challengeId="chat-lab"
              flag={challenge?.flag}
              explanation="You exploited multiple vulnerabilities in this chat application: 1) XSS via the nickname field - input wasn't properly sanitized. 2) Message spoofing via exposed API - the chatApi object allowed sending messages as any user. 3) Information disclosure - sensitive internal functions were exposed on the client. These are common real-world chat application vulnerabilities!"
            />
          </div>
        )}

        {/* Reset Button */}
        <div className="reset-section">
          <Button variant="ghost" onClick={handleReset}>
            <RefreshCw size={16} /> Reset Challenge
          </Button>
        </div>

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
                <Link to="/tutorial/chat-lab">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
