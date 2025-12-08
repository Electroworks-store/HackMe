import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { Terminal, Shield, Sparkles, Zap, BookOpen, Trophy, ArrowRight, Lock, Target, GraduationCap, HelpCircle } from 'lucide-react'
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
            <div className="hero-badge">
              <Lock size={14} />
              Educational Security Lab
            </div>
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

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <Target size={32} />
              </div>
              <h3>Choose a Challenge</h3>
              <p>
                Pick from 3 beginner-friendly security challenges, each teaching a 
                different vulnerability type.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <Terminal size={32} />
              </div>
              <h3>Exploit the Flaw</h3>
              <p>
                Use real hacking techniques to break in. Don't worry — everything 
                is simulated and safe!
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <GraduationCap size={32} />
              </div>
              <h3>Learn & Defend</h3>
              <p>
                Understand why these vulnerabilities exist and how developers 
                should prevent them.
              </p>
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
