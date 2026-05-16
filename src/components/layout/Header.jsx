import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { Home, Target, Info, Shield, Terminal, BookOpen, Menu, X } from 'lucide-react'
import { getTotalChallengeCount } from '../../data/challenges'
import ProgressBar from '../ui/ProgressBar'
import './Header.css'

export default function Header() {
  const { getCompletedCount } = useProgress()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const completed = getCompletedCount()
  const totalChallenges = getTotalChallengeCount()

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <Terminal size={24} className="logo-icon" />
          <span className="logo-text">HackMe Lab</span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
            Challenges
          </NavLink>
          <NavLink to="/fundamentals" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
            Basics
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
            About
          </NavLink>
        </nav>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="header-progress">
          <ProgressBar completed={completed} total={totalChallenges} />
        </div>
      </div>
    </header>
  )
}
