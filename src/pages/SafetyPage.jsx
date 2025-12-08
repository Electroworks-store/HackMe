import { Link } from 'react-router-dom'
import { Shield, AlertTriangle, CheckCircle, XCircle, Scale, Handshake, GraduationCap, Lock, Monitor, Theater, Palmtree } from 'lucide-react'
import Button from '../components/ui/Button'
import './SafetyPage.css'

export default function SafetyPage() {
  return (
    <div className="safety-page">
      <div className="container">
        <div className="safety-header">
          <span className="safety-icon"><Shield size={48} /></span>
          <h1>Safety & Ethics Guidelines</h1>
          <p className="subtitle">
            Please read these guidelines before using HackMe Lab
          </p>
        </div>

        <div className="safety-content">
          <section className="safety-section important">
            <h2><AlertTriangle size={20} /> Important Disclaimer</h2>
            <p>
              HackMe Lab is an <strong>educational playground</strong> designed 
              for learning purposes only. All vulnerabilities are intentionally 
              simulated and do not affect any real systems or data.
            </p>
          </section>

          <section className="safety-section">
            <h2><CheckCircle size={20} /> Do's</h2>
            <ul className="do-list">
              <li>
                <strong>Do</strong> use this platform to learn about web security concepts
              </li>
              <li>
                <strong>Do</strong> experiment freely — you cannot break anything real here
              </li>
              <li>
                <strong>Do</strong> read the tutorials to understand the vulnerabilities
              </li>
              <li>
                <strong>Do</strong> apply this knowledge to build more secure applications
              </li>
              <li>
                <strong>Do</strong> share this resource with others who want to learn
              </li>
              <li>
                <strong>Do</strong> practice on authorized platforms like Hack The Box
              </li>
            </ul>
          </section>

          <section className="safety-section">
            <h2><XCircle size={20} /> Don'ts</h2>
            <ul className="dont-list">
              <li>
                <strong>Don't</strong> use these techniques on websites you don't own
              </li>
              <li>
                <strong>Don't</strong> attack systems without explicit written permission
              </li>
              <li>
                <strong>Don't</strong> use this knowledge for malicious purposes
              </li>
              <li>
                <strong>Don't</strong> assume that finding a vulnerability gives you permission to exploit it
              </li>
              <li>
                <strong>Don't</strong> share exploits for real vulnerabilities publicly
              </li>
            </ul>
          </section>

          <section className="safety-section">
            <h2><Scale size={20} /> Legal Considerations</h2>
            <p>
              Unauthorized access to computer systems is illegal in most jurisdictions. 
              Laws like the Computer Fraud and Abuse Act (CFAA) in the US, the Computer 
              Misuse Act in the UK, and similar laws worldwide can result in severe 
              penalties including fines and imprisonment.
            </p>
            <p>
              <strong>Always obtain written permission</strong> before testing any system 
              for security vulnerabilities. Many companies have bug bounty programs that 
              provide legal authorization and even rewards for responsible disclosure.
            </p>
          </section>

          <section className="safety-section">
            <h2><Handshake size={20} /> Responsible Disclosure</h2>
            <p>
              If you ever discover a real vulnerability in a website or application:
            </p>
            <ol>
              <li>
                <strong>Don't exploit it</strong> beyond what's necessary to confirm it exists
              </li>
              <li>
                <strong>Report it privately</strong> to the organization through their security contact
              </li>
              <li>
                <strong>Give them time</strong> to fix the issue before any public disclosure
              </li>
              <li>
                <strong>Check for bug bounty programs</strong> — many companies reward researchers
              </li>
            </ol>
          </section>

          <section className="safety-section">
            <h2><GraduationCap size={20} /> This Is a Sandbox</h2>
            <p>
              To be absolutely clear about what HackMe Lab is:
            </p>
            <div className="sandbox-facts">
              <div className="fact">
                <span className="fact-icon"><Lock size={24} /></span>
                <p><strong>All data is fake.</strong> No real users, emails, or personal information.</p>
              </div>
              <div className="fact">
                <span className="fact-icon"><Monitor size={24} /></span>
                <p><strong>Everything is client-side.</strong> No real servers or databases involved.</p>
              </div>
              <div className="fact">
                <span className="fact-icon"><Theater size={24} /></span>
                <p><strong>Vulnerabilities are simulated.</strong> JavaScript mimics the behavior, nothing more.</p>
              </div>
              <div className="fact">
                <span className="fact-icon"><Palmtree size={24} /></span>
                <p><strong>Completely isolated.</strong> No connection to real systems or networks.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="safety-cta">
          <p>
            By using HackLab, you agree to use this knowledge ethically and legally.
          </p>
          <Link to="/challenges">
            <Button variant="primary" size="lg">
              I Understand — Start Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
