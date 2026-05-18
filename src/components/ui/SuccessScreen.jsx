import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import Flag from './Flag'
import NextChallengeButton from './NextChallengeButton'
import useConfetti from '../../hooks/useConfetti'
import './SuccessScreen.css'

// Encouraging messages for each challenge
const ENCOURAGING_MESSAGES = {
  'sql-login': {
    title: 'Database Breached!',
    subtitle: 'You bypassed authentication like a pro.',
    message: "Way to go! You've just learned one of the most common web vulnerabilities. Real hackers use this technique all the time."
  },
  'idor': {
    title: 'Unauthorized Access!',
    subtitle: 'You found the hidden admin profile.',
    message: "Nice detective work! You've uncovered how insecure direct object references can expose sensitive data."
  },
  'robots-cookie': {
    title: 'Cookie Monster!',
    subtitle: 'You tampered your way to admin access.',
    message: "Excellent! You've combined information disclosure with client-side manipulation. That's some serious hacker thinking!"
  },
  'localstorage-auth': {
    title: 'Storage Hacker!',
    subtitle: 'You manipulated localStorage to gain admin.',
    message: "Well done! You've proven why trusting client-side storage for authentication is a terrible idea."
  },
  'base64-token': {
    title: 'Token Forger!',
    subtitle: 'You crafted your own admin credentials.',
    message: "Brilliant! You've learned that encoding is not encryption. This vulnerability is more common than you'd think!"
  },
  'js-backdoor': {
    title: 'Backdoor Discovered!',
    subtitle: 'You exploited hidden debug functions.',
    message: "Amazing work! Finding debug code left in production is a real-world penetration testing technique."
  },
  'two-part-heist': {
    title: 'Heist Complete!',
    subtitle: 'You combined recon with logic exploitation.',
    message: "Masterful work! You chained multiple vulnerabilities together—SQL injection for reconnaissance, then business logic abuse through the fee system for profit. That's advanced attacker thinking!"
  },
  'xor-crypto': {
    title: 'Cipher Cracked!',
    subtitle: 'You broke the XOR encryption.',
    message: "Excellent cryptanalysis! You've learned why simple XOR ciphers are no match for a determined attacker. Real encryption is much more complex!"
  },
  'hidden-message': {
    title: 'Message Revealed!',
    subtitle: 'You mastered DOM manipulation and encoding.',
    message: "Outstanding! You combined three techniques: removing DOM obstacles, decoding Base64, and exploiting debug functions. These are core web security testing skills!"
  },
  'chat-lab': {
    title: 'Chat Compromised!',
    subtitle: 'You exploited XSS and message spoofing.',
    message: "Impressive work! You demonstrated how dangerous it is to trust user input in chat applications. XSS combined with API abuse is a powerful attack vector!"
  },
  'fix-the-bug': {
    title: 'Defender Mode Complete!',
    subtitle: 'You patched all vulnerabilities.',
    message: "Excellent defensive skills! You've proven you can think like both an attacker and a defender. Secure coding is the first line of defense!"
  },
  'metadata-heist': {
    title: 'Metadata Trail Blazed!',
    subtitle: 'You followed the digital breadcrumbs.',
    message: "Outstanding forensics work! You extracted hidden metadata, manipulated access controls, and cracked a multi-layer encoding chain. These are real investigator skills!"
  },
  // Hard Challenges - Aethelgard / APEX Missions
  'ciphered-incident-log': {
    title: 'Aethelgard Incident Exposed!',
    subtitle: 'You cracked the layered cipher.',
    message: "Exceptional cryptanalysis! You repaired a broken decoder, reversed a hex-XOR-base64 chain, and traced the APEX shadow service to uncover the covered-up truth about Dr. Thorne."
  },
  'breached-chat-server': {
    title: 'Protocol Breached!',
    subtitle: 'You forged admin commands.',
    message: "Outstanding protocol hacking! You reversed the weak CRC32 signature scheme, forged valid packets, and forced a partial sandbox shutdown. Real-world attackers use similar techniques!"
  },
  'operation-lost-credentials': {
    title: 'Credentials Recovered!',
    subtitle: 'You bypassed Aethelgard security.',
    message: "Masterful OSINT and persistence! You reconstructed credentials from scattered clues, discovered a developer backdoor, and bypassed flawed rate limiting. The APEX access panel is open."
  }
}

/**
 * SuccessScreen - A unified, celebratory success component for completed challenges
 * 
 * @param {string} challengeId - The ID of the completed challenge
 * @param {string} flag - The flag/reward for completing the challenge
 * @param {string} explanation - Brief explanation of what the vulnerability was
 * @param {React.ReactNode} children - Optional additional content
 */
export default function SuccessScreen({ challengeId, flag, explanation, children }) {
  // Trigger confetti on mount
  useConfetti()

  const messages = ENCOURAGING_MESSAGES[challengeId] || {
    title: 'Challenge Complete!',
    subtitle: 'You solved the puzzle.',
    message: 'Great job! Keep going to master more security concepts.'
  }

  return (
    <div className="success-screen">
      <div className="success-header">
        <Trophy size={28} className="success-trophy" />
        <h2 className="success-title">{messages.title}</h2>
        <p className="success-subtitle">{messages.subtitle}</p>
      </div>

      <Flag flag={flag} title="Your Flag" />

      <p className="success-message">{messages.message}</p>

      {explanation && (
        <p className="success-explanation">{explanation}</p>
      )}

      {children}

      <div className="success-actions">
        <NextChallengeButton currentChallengeId={challengeId} />
        <Link to="/challenges" className="back-to-challenges">
          <ArrowRight size={16} />
          View All Challenges
        </Link>
      </div>
    </div>
  )
}
