import { Link } from 'react-router-dom'
import { ArrowRight, Grid } from 'lucide-react'
import { getNextChallenge, isLastChallenge } from '../../data/challenges'
import Button from './Button'
import './NextChallengeButton.css'

export default function NextChallengeButton({ currentChallengeId }) {
  const isLast = isLastChallenge(currentChallengeId)
  const nextChallenge = getNextChallenge(currentChallengeId)

  if (isLast || !nextChallenge) {
    return (
      <div className="next-challenge-container">
        <p className="completion-message">🎉 You've completed all challenges!</p>
        <Link to="/challenges">
          <Button variant="primary" size="lg">
            <Grid size={18} />
            Back to All Challenges
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="next-challenge-container">
      <p className="next-up-label">Next up:</p>
      <Link to={nextChallenge.path}>
        <Button variant="primary" size="lg">
          {nextChallenge.shortTitle}
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  )
}
