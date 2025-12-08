import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Rocket, Grid } from 'lucide-react'
import { getTutorialById } from '../data/tutorials'
import { getChallengeById } from '../data/challenges'
import Button from '../components/ui/Button'
import { ComparisonCards, FlowDiagram, HighlightBox, CodeBlock, AttackFlow, KeyTakeaways } from '../components/ui/TutorialComponents'
import './TutorialPage.css'

// Component map for dynamic rendering
const componentMap = {
  ComparisonCards,
  FlowDiagram,
  HighlightBox,
  CodeBlock,
  AttackFlow,
  KeyTakeaways
}

// Render visual components from section data
function renderVisualComponents(visualComponents) {
  if (!visualComponents || !Array.isArray(visualComponents)) return null
  
  return visualComponents.map((vc, index) => {
    const Component = componentMap[vc.type]
    if (!Component) {
      console.warn(`Unknown visual component type: ${vc.type}`)
      return null
    }
    return <Component key={index} {...vc.props} />
  })
}

// Helper to parse markdown-like content into rich components
function renderContent(content) {
  const parts = []
  const lines = content.split('\n')
  let currentParagraph = []
  let inCodeBlock = false
  let codeBlockContent = []
  let codeBlockTitle = ''

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n')
      if (text.trim()) {
        parts.push({ type: 'paragraph', content: text })
      }
      currentParagraph = []
    }
  }

  lines.forEach((line, i) => {
    // Code block start
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph()
        inCodeBlock = true
        codeBlockTitle = line.slice(3).trim()
        codeBlockContent = []
      } else {
        // End code block
        parts.push({ type: 'code', title: codeBlockTitle, content: codeBlockContent.join('\n') })
        inCodeBlock = false
      }
      return
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      return
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      flushParagraph()
      return
    }

    // Numbered list items
    if (/^\d+\.\s/.test(line)) {
      flushParagraph()
      parts.push({ type: 'listItem', content: line.replace(/^\d+\.\s/, '') })
      return
    }

    // Bullet points
    if (line.startsWith('• ') || line.startsWith('- ')) {
      flushParagraph()
      parts.push({ type: 'bullet', content: line.slice(2) })
      return
    }

    // Bold headers within content
    if (line.startsWith('**') && line.endsWith('**')) {
      flushParagraph()
      parts.push({ type: 'subheader', content: line.slice(2, -2) })
      return
    }

    currentParagraph.push(line)
  })

  flushParagraph()

  return parts.map((part, index) => {
    switch (part.type) {
      case 'paragraph':
        return <p key={index} dangerouslySetInnerHTML={{ __html: formatInlineElements(part.content) }} />
      case 'code':
        return (
          <div key={index} className="tutorial-code-block">
            {part.title && <div className="code-title">{part.title}</div>}
            <pre><code>{part.content}</code></pre>
          </div>
        )
      case 'listItem':
        return <p key={index} className="list-item" dangerouslySetInnerHTML={{ __html: `<span class="list-num">${index}.</span> ${formatInlineElements(part.content)}` }} />
      case 'bullet':
        return <p key={index} className="bullet-item" dangerouslySetInnerHTML={{ __html: `• ${formatInlineElements(part.content)}` }} />
      case 'subheader':
        return <h4 key={index} className="content-subheader">{part.content}</h4>
      default:
        return null
    }
  })
}

// Format inline markdown elements
function formatInlineElements(text) {
  return text
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

export default function TutorialPage() {
  const { tutorialId } = useParams()
  
  const tutorial = getTutorialById(tutorialId)
  const challenge = getChallengeById(tutorialId)
  
  if (!tutorial) {
    return (
      <div className="container">
        <div className="tutorial-not-found">
          <h1>Tutorial Not Found</h1>
          <p>The requested tutorial doesn't exist.</p>
          <Link to="/challenges">
            <Button variant="primary">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tutorial-page">
      <div className="container">
        <div className="tutorial-header">
          <Link to="/challenges" className="back-link"><ArrowLeft size={16} /> Back to Challenges</Link>
          <h1><BookOpen size={24} /> {tutorial.title}</h1>
          {challenge && (
            <p className="tutorial-subtitle">
              Tutorial for: {challenge.title}
            </p>
          )}
        </div>

        <div className="tutorial-content">
          {tutorial.sections.map((section, index) => (
            <section key={index} className="tutorial-section">
              <h2>{section.title}</h2>
              <div className="section-content">
                {renderContent(section.content)}
              </div>
              {/* Render visual components if defined */}
              {section.visualComponents && (
                <div className="visual-components">
                  {renderVisualComponents(section.visualComponents)}
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="tutorial-footer">
          <div className="tutorial-actions">
            {challenge && (
              <Link to={challenge.path}>
                <Button variant="primary" size="lg">
                  <Rocket size={16} /> Try the Challenge
                </Button>
              </Link>
            )}
            <Link to="/challenges">
              <Button variant="ghost" size="lg">
                <Grid size={16} /> View All Challenges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
