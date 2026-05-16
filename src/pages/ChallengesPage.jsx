import { Link } from 'react-router-dom'
import { Target, Clock, CheckCircle, RotateCcw, BookOpen, Trophy, Syringe, KeyRound, Cookie, HardDrive, Binary, Bug, HelpCircle, Vault, KeySquare, ScanEye, MessageCircle, ShieldCheck, Image, FileText, MessageSquare, Key, Shuffle, AlertCircle, Radio } from 'lucide-react'
import { useProgress } from '../context/ProgressContext'
import { challenges } from '../data/challenges'
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
  'hidden-message': ScanEye,
  'chat-lab': MessageCircle,
  'fix-the-bug': ShieldCheck,
  'metadata-heist': Image,
  'ciphered-incident-log': FileText,
  'breached-chat-server': MessageSquare,
  'operation-lost-credentials': Key,
  'prng-prediction': Shuffle,
  'canary-flag': AlertCircle,
  'silent-record': Radio
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
              <div
                key={challenge.id}
                className={`challenge-card challenge-${challenge.difficulty.toLowerCase()}${completed ? ' is-done' : ''}`}
              >
                {/* Header row: icon + done pill + tutorial button */}
                <div className="cc-header">
                  <div className="cc-icon-box">
                    {IconComponent && <IconComponent size={20} />}
                  </div>
                  <div className="cc-header-right">
                    {completed && (
                      <span className="cc-done-pill">
                        <CheckCircle size={13} /> Done
                      </span>
                    )}
                    <Link
                      to={challenge.tutorialPath}
                      className="cc-tutorial"
                      onClick={(e) => e.stopPropagation()}
                      title="View tutorial"
                    >
                      <BookOpen size={14} />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <h3 className="cc-title">{challenge.title}</h3>
                <p className="cc-desc">{challenge.description}</p>

                {/* Skills */}
                <div className="cc-skills">
                  {challenge.skills.slice(0, 2).map((skill, i) => (
                    <span key={i} className="cc-skill">{skill}</span>
                  ))}
                </div>

                {/* Footer: meta + CTA */}
                <div className="cc-footer">
                  <div className="cc-meta-left">
                    <Badge variant={challenge.difficulty.toLowerCase()} size="sm">
                      {challenge.difficulty}
                    </Badge>
                    <span className="cc-time">
                      <Clock size={12} /> {challenge.estimatedTime}
                    </span>
                  </div>
                  <div className={`cc-cta${completed ? ' cc-cta-secondary' : ''}`}>
                    {completed ? 'Try Again' : 'Start'}
                  </div>
                </div>

                {/* Stretched link — makes the whole card clickable */}
                <Link
                  to={challenge.path}
                  className="cc-stretched-link"
                  aria-label={`Start ${challenge.title}`}
                />
              </div>
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
