import { Link, NavLink } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { Home, Target, Info, Shield, Terminal, BookOpen } from 'lucide-react'
import { getTotalChallengeCount } from '../../data/challenges'
import ProgressBar from '../ui/ProgressBar'
import './Header.css'

export default function Header() {
  const { getCompletedCount } = useProgress()
  const completed = getCompletedCount()
  const totalChallenges = getTotalChallengeCount()

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="header-logo">
          <Terminal size={24} className="logo-icon" />
          <span className="logo-text">HackMe Lab</span>
        </Link>

        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            Home
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Challenges
          </NavLink>
          <NavLink to="/fundamentals" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Basics
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            About
          </NavLink>
        </nav>

        <div className="header-progress">
          <ProgressBar completed={completed} total={totalChallenges} />
        </div>
      </div>
    </header>
  )
}
