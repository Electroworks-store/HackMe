import { Link } from 'react-router-dom'
import { Terminal, Lock, ExternalLink, Heart } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-brand">
          <Terminal size={20} className="footer-logo" />
          <span>HackMe Lab</span>
        </div>
        
        <div className="footer-links">
          <Link to="/challenges">Challenges</Link>
          <Link to="/about">About</Link>
          <Link to="/safety">Safety</Link>
        </div>

        <div className="footer-disclaimer">
          <Lock size={14} />
          <p>Educational demo only. All data is fake. Never hack real systems.</p>
        </div>

        <div className="footer-credits">
          <p>Made with <Heart size={14} className="heart-icon" /> by the <a href="https://rootlabs.com" target="_blank" rel="noopener noreferrer">RootLabs<ExternalLink size={12} /></a> team</p>
        </div>

        <div className="footer-copyright">
          <p>© 2025 For educational purposes only.</p>
        </div>
      </div>
    </footer>
  )
}
