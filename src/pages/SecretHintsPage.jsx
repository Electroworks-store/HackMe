import { Link } from 'react-router-dom'
import { Search, Lightbulb, AlertTriangle, Cookie } from 'lucide-react'
import Button from '../components/ui/Button'
import './SecretHintsPage.css'

export default function SecretHintsPage() {
  return (
    <div className="secret-hints-page">
      <div className="container">
        <div className="secret-content">
          <div className="secret-header">
            <span className="secret-icon"><Search size={48} /></span>
            <h1>You found the secret page!</h1>
            <p>
              Nice work checking the robots.txt file. That's exactly how security 
              researchers find hidden endpoints!
            </p>
          </div>

          <div className="hint-box">
            <h2><Lightbulb size={20} /> Hints for the Cookie Challenge</h2>
            
            <div className="hint-item">
              <h3>Hint #1: How Authorization Works Here</h3>
              <p>
                This (intentionally insecure) application stores user roles in a 
                browser cookie. The cookie determines what you can access.
              </p>
            </div>

            <div className="hint-item">
              <h3>Hint #2: The Cookie Name</h3>
              <p>
                Look for a cookie named <code>hacklab_role</code> in your browser.
              </p>
            </div>

            <div className="hint-item">
              <h3>Hint #3: Cookie Values</h3>
              <p>
                The current value is probably <code>user</code>. What if you changed 
                it to something more... <em>privileged</em>?
              </p>
            </div>

            <div className="hint-item">
              <h3>Hint #4: How to Change Cookies</h3>
              <p>
                Open your browser's Developer Tools (F12 or Ctrl+Shift+I), then:
              </p>
              <ol>
                <li>Go to the <strong>Application</strong> tab (Chrome) or <strong>Storage</strong> tab (Firefox)</li>
                <li>Find <strong>Cookies</strong> in the sidebar</li>
                <li>Click on the current site</li>
                <li>Find the <code>hacklab_role</code> cookie</li>
                <li>Double-click the value to edit it</li>
                <li>Change <code>user</code> to <code>admin</code></li>
                <li>Go back to the challenge page!</li>
              </ol>
            </div>
          </div>

          <div className="warning-box">
            <h3><AlertTriangle size={18} /> Real-World Warning</h3>
            <p>
              In the real world, well-designed applications <strong>never</strong> trust 
              client-side data like cookies for authorization decisions. They use:
            </p>
            <ul>
              <li>Server-side sessions</li>
              <li>Cryptographically signed tokens (like JWTs)</li>
              <li>Database lookups for every request</li>
            </ul>
            <p>
              This challenge demonstrates what happens when developers make the 
              mistake of trusting the client.
            </p>
          </div>

          <div className="actions">
            <Link to="/challenge/robots-cookie">
              <Button variant="primary" size="lg">
                <Cookie size={16} /> Back to Cookie Challenge
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
