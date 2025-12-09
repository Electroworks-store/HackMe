import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/ui/ScrollToTop'
import HomePage from './pages/HomePage'
import ChallengesPage from './pages/ChallengesPage'
import ChallengePage from './pages/ChallengePage'
import TutorialPage from './pages/TutorialPage'
import FundamentalsPage from './pages/FundamentalsPage'
import SecretHintsPage from './pages/SecretHintsPage'
import AboutPage from './pages/AboutPage'
import SafetyPage from './pages/SafetyPage'
import NotFoundPage from './pages/NotFoundPage'
import useEasterEggs from './hooks/useEasterEggs'

function App() {
  // Initialize easter eggs (Konami code, console messages, etc.)
  useEasterEggs()
  
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/fundamentals" element={<FundamentalsPage />} />
          <Route path="/fundamentals/:tabId" element={<FundamentalsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          
          {/* Challenge Routes */}
          <Route path="/challenge/:challengeId" element={<ChallengePage />} />
          
          {/* Tutorial Routes */}
          <Route path="/tutorial/:tutorialId" element={<TutorialPage />} />
          
          {/* Secret Hints Page (discoverable via robots.txt) */}
          <Route path="/super-secret-admin-hints" element={<SecretHintsPage />} />
          
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
