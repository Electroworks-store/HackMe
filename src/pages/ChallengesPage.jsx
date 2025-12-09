import { Link } from 'react-router-dom'
import { Target, Clock, CheckCircle, RotateCcw, BookOpen, Trophy, Syringe, KeyRound, Cookie, HardDrive, Binary, Bug, HelpCircle, Vault, KeySquare, ScanEye } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { challenges } from '../data/challenges'
import Card, { CardBody, CardFooter } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import './ChallengesPage.css'

// Map challenge IDs to their icons
const challengeIcons = {
  'sql-login': Syringe,
  'idor': KeyRound,
  'robots-cookie': Cookie,
  'localstorage-auth': HardDrive,
  'base64-token': Binary,
  'js-backdoor': Bug,
  'two-part-heist': Vault,
  'xor-crypto': KeySquare,
  'hidden-message': ScanEye
}

export default function ChallengesPage() {
  const { isCompleted, getCompletedCount, resetProgress } = useProgress()
  const completedCount = getCompletedCount()
  const totalChallenges = challenges.length

  return (
    <div className="challenges-page">
      <div className="container">
        <div className="page-header">
          <h1><Target className="page-title-icon" size={28} /> Security Challenges</h1>
          <p>
            Choose a challenge below to test your hacking skills. Each challenge 
            teaches a different web security concept.
          </p>
          
          <div className="progress-summary">
            <div className="progress-info">
              <span className="progress-label">Your Progress:</span>
              <span className="progress-value">{completedCount}/{totalChallenges} Completed</span>
            </div>
            {completedCount > 0 && (
              <button className="reset-btn" onClick={resetProgress}>
                <RotateCcw size={14} /> Reset Progress
              </button>
            )}
          </div>
        </div>

        {/* Fundamentals Link */}
        <div className="fundamentals-banner">
          <div className="banner-content">
            <HelpCircle size={24} />
            <div className="banner-text">
              <strong>New to web security?</strong>
              <span>Learn the basics of HTML, CSS, JavaScript, and more before diving into challenges.</span>
            </div>
          </div>
          <Link to="/fundamentals">
            <Button variant="ghost">
              <BookOpen size={14} /> Web Fundamentals
            </Button>
          </Link>
        </div>

        <div className="challenges-grid">
          {challenges.map((challenge) => {
            const completed = isCompleted(challenge.id)
            const IconComponent = challengeIcons[challenge.id]
            
            return (
              <Card 
                key={challenge.id} 
                variant={completed ? 'success' : 'default'}
                className="challenge-card"
              >
                <CardBody>
                  <div className="card-top">
                    <span className="challenge-icon">
                      {IconComponent && <IconComponent size={32} />}
                    </span>
                    {completed && (
                      <span className="completed-badge">
                        <CheckCircle size={14} /> Completed
                      </span>
                    )}
                  </div>
                  
                  <h3 className="challenge-title">{challenge.title}</h3>
                  
                  <div className="challenge-meta">
                    <Badge variant={challenge.difficulty.toLowerCase()}>{challenge.difficulty}</Badge>
                    <span className="challenge-time"><Clock size={14} /> {challenge.estimatedTime}</span>
                  </div>
                  
                  <p className="challenge-description">{challenge.description}</p>
                  
                  <div className="challenge-skills">
                    {challenge.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </CardBody>
                
                <CardFooter>
                  <div className="card-actions">
                    <Link to={challenge.path}>
                      <Button variant="primary">
                        {completed ? 'Try Again' : 'Start Challenge'}
                      </Button>
                    </Link>
                    <Link to={challenge.tutorialPath}>
                      <Button variant="ghost">
                        <BookOpen size={14} /> Tutorial
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {completedCount === 3 && (
          <div className="all-complete">
            <div className="all-complete-content">
              <span className="trophy"><Trophy size={40} /></span>
              <h2>Congratulations!</h2>
              <p>
                You've completed all challenges! You now understand SQL Injection, 
                IDOR, and Cookie Tampering vulnerabilities.
              </p>
              <p className="reminder">
                Remember: Only use these skills ethically and on systems you have 
                permission to test!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
