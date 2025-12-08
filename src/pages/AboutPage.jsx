import { Link } from 'react-router-dom'
import { Target, Lock, Building2, BookOpen, ExternalLink, Rocket, Shield } from 'lucide-react'
import Button from '../components/ui/Button'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About HackMe Lab</h1>
          <p className="subtitle">
            A safe space to learn web security through hands-on practice
          </p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2><Target size={20} /> Our Mission</h2>
            <p>
              HackMe Lab was created to help people understand web security 
              vulnerabilities in a safe, legal, and educational environment. We believe 
              that the best way to learn about security is through hands-on experience.
            </p>
            <p>
              By providing a controlled playground where you can safely exploit 
              intentional vulnerabilities, we aim to:
            </p>
            <ul>
              <li>Teach fundamental security concepts</li>
              <li>Build awareness about common vulnerabilities</li>
              <li>Help developers write more secure code</li>
              <li>Foster ethical hacking practices</li>
            </ul>
          </section>

          <section className="about-section">
            <h2><Lock size={20} /> What Makes This Safe?</h2>
            <p>
              Everything in HackMe Lab is <strong>completely simulated</strong>:
            </p>
            <ul>
              <li>
                <strong>No real database:</strong> The "SQL injection" challenge uses 
                JavaScript string matching, not actual SQL queries.
              </li>
              <li>
                <strong>No real users:</strong> All profile data is fake and hardcoded 
                in the frontend.
              </li>
              <li>
                <strong>No real authentication:</strong> Cookies and "admin access" are 
                purely simulated for learning purposes.
              </li>
              <li>
                <strong>No network calls:</strong> Everything runs locally in your 
                browser with no external API connections.
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2><Building2 size={20} /> About the Project</h2>
            <p>
              The companies and data used in HackMe Lab are <strong>entirely fictional</strong> and 
              created for this educational demo. Any resemblance to real companies is coincidental.
            </p>
            <p>
              This project is designed to showcase security awareness and can be used 
              by educators, students, and anyone interested in learning about web security.
            </p>
          </section>

          <section className="about-section">
            <h2><BookOpen size={20} /> Learn More</h2>
            <p>
              Want to dive deeper into web security? Check out these resources:
            </p>
            <ul>
              <li>
                <a href="https://owasp.org/Top10/" target="_blank" rel="noopener noreferrer">
                  OWASP Top 10
                </a> — The most critical web application security risks
              </li>
              <li>
                <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer">
                  PortSwigger Web Security Academy
                </a> — Free web security training
              </li>
              <li>
                <a href="https://www.hackthebox.com/" target="_blank" rel="noopener noreferrer">
                  Hack The Box
                </a> — Advanced penetration testing labs
              </li>
            </ul>
          </section>
        </div>

        <div className="about-cta">
          <h3>Ready to start learning?</h3>
          <div className="cta-buttons">
            <Link to="/challenges">
              <Button variant="primary" size="lg">
                <Rocket size={16} /> View Challenges
              </Button>
            </Link>
            <Link to="/safety">
              <Button variant="secondary" size="lg">
                <Shield size={16} /> Safety Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
