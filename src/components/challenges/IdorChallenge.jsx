import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, Target, MapPin, AlertTriangle, Search, EyeOff, Lightbulb, Shield } from 'lucide-react'
import { useProgress } from '../../context/ProgressContext'
import { getChallengeById } from '../../data/challenges'
import { getUserById, getRegularUsers, isAdminUser } from '../../data/fakeUsers'
import Button from '../ui/Button'
import SuccessScreen from '../ui/SuccessScreen'
import './IdorChallenge.css'

export default function IdorChallenge() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hintIndex, setHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const { markCompleted, isCompleted } = useProgress()
  
  const challenge = getChallengeById('idor')
  const alreadyCompleted = isCompleted('idor')

  // Get userId from URL, default to 1
  const userIdParam = searchParams.get('userId')
  const userId = userIdParam !== null ? parseInt(userIdParam, 10) : 1
  
  const currentUser = getUserById(userId)
  const regularUsers = getRegularUsers()
  const isAdmin = isAdminUser(userId)

  // Mark as completed when admin is found
  useEffect(() => {
    if (isAdmin && !alreadyCompleted) {
      markCompleted('idor')
    }
  }, [isAdmin, alreadyCompleted, markCompleted])

  const handleUserChange = (newUserId) => {
    setSearchParams({ userId: newUserId.toString() })
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
            You've found the employee directory of HackMe Lab. The URL shows which 
            profile you're viewing via a <code>userId</code> parameter.
          </p>
          <p>
            Hmm... there are employees 1 through 5. But are there any other user IDs 
            in the system? What might user ID 0 contain?
          </p>
        </div>

        {/* URL Display */}
        <div className="url-display">
          <span className="url-label"><MapPin size={14} /> Current URL:</span>
          <code className="url-value">
            /challenge/idor?userId=<span className="url-highlight">{userId}</span>
          </code>
        </div>

        {/* Quick User Navigation */}
        <div className="user-nav">
          <span className="user-nav-label">View profile:</span>
          <div className="user-nav-buttons">
            {regularUsers.map(user => (
              <button
                key={user.id}
                className={`user-nav-btn ${userId === user.id ? 'active' : ''}`}
                onClick={() => handleUserChange(user.id)}
              >
                #{user.id}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Display */}
        {isAdmin ? (
          /* Admin Panel - SUCCESS! */
          <div className="admin-panel">
            <div className="admin-header">
              <h2><AlertTriangle size={20} /> ADMIN PANEL</h2>
              <p>You found the hidden admin profile!</p>
            </div>
            
            <div className="admin-content">
              <div className="admin-user-info">
                <div className="admin-avatar">{currentUser.name.slice(0, 2)}</div>
                <div className="admin-details">
                  <h3>{currentUser.name}</h3>
                  <p className="admin-role">{currentUser.role}</p>
                  <p>{currentUser.email}</p>
                </div>
              </div>
              
              <SuccessScreen
                challengeId="idor"
                flag={challenge.flag}
                explanation="You discovered an IDOR vulnerability! The application uses the userId directly from the URL without checking if you're authorized to view it. Special IDs like 0 or 999 often contain admin accounts."
              />
            </div>
          </div>
        ) : currentUser ? (
          /* Regular User Profile */
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{currentUser.name.charAt(0)}</div>
              <div className="profile-info">
                <h3>{currentUser.name}</h3>
                <span className="profile-role">{currentUser.role}</span>
              </div>
            </div>
            
            <div className="profile-body">
              <div className="profile-field">
                <span className="field-label">Email</span>
                <span className="field-value">{currentUser.email}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Department</span>
                <span className="field-value">{currentUser.department}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Joined</span>
                <span className="field-value">{currentUser.joinDate}</span>
              </div>
              <div className="profile-field bio">
                <span className="field-label">Bio</span>
                <span className="field-value">{currentUser.bio}</span>
              </div>
            </div>
          </div>
        ) : (
          /* User Not Found */
          <div className="profile-card not-found">
            <div className="not-found-content">
              <span className="not-found-icon"><Search size={32} /></span>
              <h3>User Not Found</h3>
              <p>No user exists with ID {userId}.</p>
              <p className="not-found-hint">
                Keep trying different IDs... some systems have special reserved IDs.
              </p>
            </div>
          </div>
        )}

        {/* Hint Section */}
        <div className="hint-section">
          <button 
            className="hint-toggle"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? <><EyeOff size={16} /> Hide Hints</> : <><Lightbulb size={16} /> Need a Hint?</>}
          </button>
          
          {showHint && (
            <div className="hints-content">
              {hintIndex >= 0 && <p><strong>Hint 1:</strong> The URL parameter controls which profile you see.</p>}
              {hintIndex >= 1 && <p><strong>Hint 2:</strong> Admin accounts are often created first in a system.</p>}
              {hintIndex >= 2 && <p><strong>Hint 3:</strong> Try <code>?userId=0</code> or <code>?userId=999</code></p>}
              {hintIndex < 2 && (
                <button className="next-hint-btn" onClick={() => setHintIndex(hintIndex + 1)}>
                  Next Hint →
                </button>
              )}
              <p className="hint-note">
                For a full explanation, check the{' '}
                <Link to="/tutorial/idor">tutorial</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
