import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { Terminal, Shield, Sparkles, Zap, BookOpen, Trophy, ArrowRight, Lock, Target, HelpCircle, Code, Database, Cookie, AlertTriangle, Eye, Key, Fingerprint, ChevronRight, Crosshair, Radar } from 'lucide-react'
import { getTotalChallengeCount } from '../data/challenges'
import Button from '../components/ui/Button'
import './HomePage.css'

export default function HomePage() {
  const { getCompletedCount } = useProgress()
  const completed = getCompletedCount()
  const totalChallenges = getTotalChallengeCount()

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Hack this site<br />
              <span className="gradient-text">(on purpose).</span>
            </h1>
            <p className="hero-description">
              Welcome to HackMe Lab — a safe, isolated playground where you can 
              learn web security concepts by exploiting intentional vulnerabilities. 
              No real systems. No real data. Just pure learning.
            </p>
            <div className="hero-actions">
              <Link to="/challenges">
                <Button variant="primary" size="lg">
                  <Zap size={18} />
                  Start Hacking
                </Button>
              </Link>
              <Link to="/fundamentals">
                <Button variant="secondary" size="lg">
                  <HelpCircle size={18} />
                  New? Start Here
                </Button>
              </Link>
            </div>
            {completed > 0 && (
              <div className="hero-progress">
                <Sparkles size={16} />
                You've completed {completed}/{totalChallenges} challenges!
              </div>
            )}
          </div>
          
          <div className="hero-visual">
            <div className="terminal-preview">
              <div className="terminal-header-mini">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="terminal-body-mini">
                <code>
                  <span className="prompt">$</span> ./hack --target hackme-lab<br />
                  <span className="output">[*] Scanning for vulnerabilities...</span><br />
                  <span className="output">[+] Found: SQL Injection</span><br />
                  <span className="output">[+] Found: IDOR</span><br />
                  <span className="output">[+] Found: Cookie Tampering</span><br />
                  <span className="success">[✓] Ready to exploit!</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Briefing */}
      <section className="mission-briefing">
        <div className="container">
          <div className="briefing-card">
            <div className="briefing-header">
              <div className="briefing-icon">
                <Crosshair size={28} />
              </div>
              <div className="briefing-label">
                <span className="label-text">CLASSIFIED</span>
                <span className="label-dot"></span>
                <span className="label-status">EYES ONLY</span>
              </div>
            </div>
            
            <div className="briefing-content">
              <h2>Welcome, Hacker.</h2>
              <div className="story-text">
                <p>
                  A rogue corporation called <strong>NullSec Industries</strong> has been running vulnerable systems for years — leaking user data, storing passwords in plaintext, and ignoring every security best practice in the book.
                </p>
                <p>
                  We've set up an exact replica of their infrastructure. Your job? Break in. Find the flags they tried to hide. Expose every flaw.
                </p>
                <p>
                  Each vulnerability you exploit teaches you how real attackers think — and how to stop them. No rules. No consequences. Just you against the machine.
                </p>
              </div>
              <div className="briefing-footer">
                <div className="scan-line"></div>
                <p className="briefing-note">// All systems sandboxed. No real data at risk. Good luck.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="skills-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon"><Radar size={24} /></div>
            <h2 className="section-title">Attack Vectors</h2>
            <p className="section-subtitle">Master these techniques used by real hackers and security researchers</p>
          </div>
          
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-number">01</div>
              <div className="skill-icon"><Database size={24} /></div>
              <div className="skill-content">
                <h4>SQL Injection</h4>
                <p>Bypass authentication by manipulating database queries</p>
              </div>
              <div className="skill-glow"></div>
            </div>
            <div className="skill-card">
              <div className="skill-number">02</div>
              <div className="skill-icon"><Cookie size={24} /></div>
              <div className="skill-content">
                <h4>Cookie Tampering</h4>
                <p>Modify session data to escalate privileges</p>
              </div>
              <div className="skill-glow"></div>
            </div>
            <div className="skill-card">
              <div className="skill-number">03</div>
              <div className="skill-icon"><Fingerprint size={24} /></div>
              <div className="skill-content">
                <h4>IDOR Attacks</h4>
                <p>Access resources belonging to other users</p>
              </div>
              <div className="skill-glow"></div>
            </div>
            <div className="skill-card">
              <div className="skill-number">04</div>
              <div className="skill-icon"><Code size={24} /></div>
              <div className="skill-content">
                <h4>DevTools Mastery</h4>
                <p>Inspect, modify, and manipulate web pages</p>
              </div>
              <div className="skill-glow"></div>
            </div>
            <div className="skill-card">
              <div className="skill-number">05</div>
              <div className="skill-icon"><Key size={24} /></div>
              <div className="skill-content">
                <h4>Crypto Attacks</h4>
                <p>Break weak encryption and decode hidden data</p>
              </div>
              <div className="skill-glow"></div>
            </div>
            <div className="skill-card">
              <div className="skill-number">06</div>
              <div className="skill-icon"><Eye size={24} /></div>
              <div className="skill-content">
                <h4>Recon & Discovery</h4>
                <p>Find secrets hidden in plain sight</p>
              </div>
              <div className="skill-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here CTA */}
      <section className="start-here">
        <div className="container">
          <div className="start-here-content">
            <div className="start-here-text">
              <span className="start-badge"><HelpCircle size={14} /> New to Security?</span>
              <h2>Start with the Fundamentals</h2>
              <p>
                Learn how the web works, how to use browser DevTools, and key security concepts before diving into challenges. Perfect for beginners!
              </p>
              <Link to="/fundamentals">
                <Button variant="secondary" size="lg">
                  <BookOpen size={18} />
                  Go to Fundamentals
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </div>
            <div className="start-here-visual">
              <div className="fundamentals-preview">
                <div className="preview-item">
                  <Code size={20} />
                  <span>How the Web Works</span>
                </div>
                <div className="preview-item">
                  <Terminal size={20} />
                  <span>DevTools Basics</span>
                </div>
                <div className="preview-item">
                  <Shield size={20} />
                  <span>Security Concepts</span>
                </div>
                <div className="preview-item">
                  <AlertTriangle size={20} />
                  <span>Common Vulnerabilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">
                <Lock size={28} />
              </span>
              <h4>100% Safe</h4>
              <p>All vulnerabilities are simulated. No real systems at risk.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <BookOpen size={28} />
              </span>
              <h4>Educational</h4>
              <p>Learn security concepts with hands-on practice.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <Target size={28} />
              </span>
              <h4>Beginner Friendly</h4>
              <p>No prior hacking experience required.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <Trophy size={28} />
              </span>
              <h4>Track Progress</h4>
              <p>Earn flags and track your completed challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to test your skills?</h2>
            <p>
              Jump into the challenges and see if you can capture all the flags!
            </p>
            <Link to="/challenges">
              <Button variant="primary" size="lg">
                View Challenges
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
