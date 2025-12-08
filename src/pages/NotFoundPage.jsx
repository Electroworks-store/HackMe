import { Link } from 'react-router-dom'
import { Home, Target, HelpCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="glitch-text">404</div>
          <h1>Page Not Found</h1>
          <p>
            Looks like you've wandered into uncharted territory. 
            This page doesn't exist... or does it? <HelpCircle size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </p>
          <p className="hint">
            (If you're looking for hidden pages, try checking <code>/robots.txt</code>)
          </p>
          
          <div className="not-found-actions">
            <Link to="/">
              <Button variant="primary" size="lg">
                <Home size={16} /> Go Home
              </Button>
            </Link>
            <Link to="/challenges">
              <Button variant="secondary" size="lg">
                <Target size={16} /> View Challenges
              </Button>
            </Link>
          </div>

          <div className="terminal-404">
            <div className="terminal-header-mini">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-body-mini">
              <code>
                <span className="prompt">$</span> curl {window.location.href}<br />
                <span className="error">HTTP/1.1 404 Not Found</span><br />
                <span className="output">{"{"} "error": "Resource not found" {"}"}</span><br />
                <span className="prompt">$</span> <span className="cursor">_</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
