import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { Terminal, Shield, Sparkles, Zap, GraduationCap, Trophy, ArrowRight, Lock, Target, Code, Database, Cookie, AlertTriangle, Eye, Key, Fingerprint, Crosshair, HelpCircle } from 'lucide-react'
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
              Welcome to HackMe Lab, an interactive playground designed to teach web security by letting you exploit safe, simulated flaws. 
              Learn by doing, break things freely, and understand how real systems fail.
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
            <div className="hero-credit">Made by RootLabs</div>
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
                  <span className="success">[+] Ready to exploit!</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Briefing */}
      <section className="your-mission-briefing">
        <div className="container">
          <div className="briefing-layout">
            <div className="briefing-text-col">
              <div className="briefing-icon-minimal">
                <Crosshair size={32} />
              </div>
              <h2 className="briefing-title">Welcome, Hacker.</h2>
              <div className="briefing-text">
                <p>
                  Your mission begins here: uncover the security failures hidden inside the <strong>Confidential Information Bureau.</strong>
                </p>
                <p>
                  They have spent years running systems held together with duct tape, optimism, and firewalls configured by someone who definitely failed math.
                </p>
                <p>
                  We built a full replica of their network so you can safely tear it apart. Find the flags, expose the flaws, and leave nothing hidden.
                </p>
                <p className="briefing-tagline">
                  No risk. No lawyers. Just you and your brain.
                </p>
              </div>
            </div>
            <div className="briefing-visual-col">
              <svg className="hacker-laptop-svg" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Laptop base */}
                <rect x="50" y="200" width="300" height="15" rx="3" fill="#1a2235" stroke="currentColor" strokeWidth="1.5"/>
                
                {/* Laptop screen frame */}
                <rect x="70" y="50" width="260" height="155" rx="8" fill="#0d1117" stroke="currentColor" strokeWidth="1.5"/>
                
                {/* Screen inner */}
                <rect x="82" y="62" width="236" height="131" rx="2" fill="#161b22"/>
                
                {/* Code lines on screen */}
                <g className="code-lines">
                  {/* Line 1 - function declaration */}
                  <rect x="95" y="75" width="60" height="8" rx="2" fill="#00ff88" opacity="0.9"/>
                  <rect x="160" y="75" width="40" height="8" rx="2" fill="#7ee787" opacity="0.6"/>
                  <rect x="205" y="75" width="25" height="8" rx="2" fill="#58a6ff" opacity="0.7"/>
                  
                  {/* Line 2 - variable */}
                  <rect x="105" y="92" width="35" height="8" rx="2" fill="#ff7b72" opacity="0.8"/>
                  <rect x="145" y="92" width="55" height="8" rx="2" fill="#79c0ff" opacity="0.7"/>
                  <rect x="205" y="92" width="70" height="8" rx="2" fill="#a5d6ff" opacity="0.5"/>
                  
                  {/* Line 3 - if statement */}
                  <rect x="105" y="109" width="25" height="8" rx="2" fill="#ff7b72" opacity="0.8"/>
                  <rect x="135" y="109" width="80" height="8" rx="2" fill="#ffa657" opacity="0.6"/>
                  
                  {/* Line 4 - nested code */}
                  <rect x="115" y="126" width="45" height="8" rx="2" fill="#00ff88" opacity="0.7"/>
                  <rect x="165" y="126" width="90" height="8" rx="2" fill="#7ee787" opacity="0.5"/>
                  
                  {/* Line 5 - return */}
                  <rect x="115" y="143" width="55" height="8" rx="2" fill="#ff7b72" opacity="0.8"/>
                  <rect x="175" y="143" width="40" height="8" rx="2" fill="#00ff88" opacity="0.9"/>
                  
                  {/* Line 6 - closing */}
                  <rect x="105" y="160" width="15" height="8" rx="2" fill="#8b949e" opacity="0.6"/>
                  
                  {/* Line 7 - flag highlight */}
                  <rect x="95" y="177" width="80" height="8" rx="2" fill="#00ff88" opacity="1"/>
                  <rect x="180" y="177" width="100" height="8" rx="2" fill="#ffd700" opacity="0.9"/>
                </g>
                
                {/* Cursor blink */}
                <rect className="cursor-blink" x="285" y="177" width="8" height="10" fill="#00ff88">
                  <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
                </rect>
                
                {/* Screen glare effect */}
                <rect x="82" y="62" width="236" height="131" rx="2" fill="url(#screenGlare)" opacity="0.03"/>
                
                {/* Keyboard area hint */}
                <rect x="80" y="205" width="240" height="6" rx="1" fill="#252d3a"/>
                
                {/* Trackpad hint */}
                <rect x="165" y="207" width="70" height="4" rx="1" fill="#1a2235" stroke="#2d3748" strokeWidth="0.5"/>
                
                {/* Decorative circuit lines */}
                <g className="circuit-lines" stroke="#00ff88" strokeWidth="0.5" opacity="0.2">
                  <path d="M30 250 L30 220 L50 220"/>
                  <path d="M370 250 L370 220 L350 220"/>
                  <circle cx="30" cy="250" r="3" fill="#00ff88"/>
                  <circle cx="370" cy="250" r="3" fill="#00ff88"/>
                </g>
                
                <defs>
                  <linearGradient id="screenGlare" x1="82" y1="62" x2="318" y2="193" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.1"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Attack Vectors */}
      <section className="attack-vectors">
        <div className="container">
          <h2 className="vectors-title">Attack Vectors</h2>
          <p className="vectors-subtitle">Master these techniques used by real hackers and security researchers</p>
          
          <div className="vectors-diagram">
            <div className="vector-row">
              <div className="vector-item">
                <span className="vector-num">01</span>
                <Database size={20} />
                <span className="vector-name">SQL Injection</span>
              </div>
              <div className="vector-connector"></div>
              <div className="vector-item">
                <span className="vector-num">02</span>
                <Cookie size={20} />
                <span className="vector-name">Cookie Tampering</span>
              </div>
              <div className="vector-connector"></div>
              <div className="vector-item">
                <span className="vector-num">03</span>
                <Fingerprint size={20} />
                <span className="vector-name">IDOR Attacks</span>
              </div>
            </div>
            
            <div className="vector-center">
              <div className="center-hub">
                <Shield size={28} />
                <span>Target System</span>
              </div>
            </div>
            
            <div className="vector-row">
              <div className="vector-item">
                <span className="vector-num">04</span>
                <Code size={20} />
                <span className="vector-name">DevTools Mastery</span>
              </div>
              <div className="vector-connector"></div>
              <div className="vector-item">
                <span className="vector-num">05</span>
                <Key size={20} />
                <span className="vector-name">Crypto Attacks</span>
              </div>
              <div className="vector-connector"></div>
              <div className="vector-item">
                <span className="vector-num">06</span>
                <Eye size={20} />
                <span className="vector-name">Recon & Discovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here CTA */}
      <section className="start-here">
        <div className="container">
          <div className="fundamentals-layout">
            <div className="fundamentals-content">
              <span className="start-label">New to Security?</span>
              <h2>Start with the Fundamentals</h2>
              <p className="fundamentals-intro">
                Master the basics before breaking into systems. Learn how the web works, 
                discover DevTools, and understand security concepts through interactive lessons.
              </p>
              
              <div className="learning-flow">
                <div className="flow-item">
                  <div className="flow-number">1</div>
                  <span>Learn</span>
                </div>
                <ArrowRight size={16} className="flow-arrow" />
                <div className="flow-item">
                  <div className="flow-number">2</div>
                  <span>Practice</span>
                </div>
                <ArrowRight size={16} className="flow-arrow" />
                <div className="flow-item">
                  <div className="flow-number">3</div>
                  <span>Exploit</span>
                </div>
              </div>
              
              <Link to="/fundamentals">
                <Button variant="secondary" size="lg" className="fundamentals-cta">
                  Go to Fundamentals
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            <div className="fundamentals-visual">
              <GraduationCap size={140} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-bar">
            <div className="feature-item">
              <Lock size={20} className="feature-icon" />
              <h4>Safe Sandbox</h4>
              <p>All vulnerabilities are simulated in an isolated environment.</p>
            </div>
            <div className="feature-divider"></div>
            <div className="feature-item">
              <Code size={20} className="feature-icon" />
              <h4>Hands-On Learning</h4>
              <p>Understand real security concepts by experimenting.</p>
            </div>
            <div className="feature-divider"></div>
            <div className="feature-item">
              <Target size={20} className="feature-icon" />
              <h4>Beginner Friendly</h4>
              <p>Start from zero - no prior hacking knowledge needed.</p>
            </div>
            <div className="feature-divider"></div>
            <div className="feature-item">
              <Trophy size={20} className="feature-icon" />
              <h4>Progress Tracking</h4>
              <p>Earn flags and monitor challenge completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-minimal">
            <div className="cta-left">
              <h2>Ready to test your skills?</h2>
              <p>Jump into the challenges and capture all the flags.</p>
            </div>
            <div className="cta-right">
              <Link to="/challenges">
                <Button variant="primary" size="lg">
                  View Challenges
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
