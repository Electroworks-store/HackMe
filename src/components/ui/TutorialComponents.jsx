import { AlertTriangle, CheckCircle, XCircle, Lightbulb, ArrowRight, Info, Shield, ShieldOff } from 'lucide-react'
import './TutorialComponents.css'

// Helper to strip emojis from text
function stripEmojis(text) {
  if (!text) return text
  return text.replace(/[✅❌🔍🔐📝]/g, '').trim()
}

// Comparison cards: Side-by-side code comparison
export function ComparisonCards({ leftTitle, rightTitle, leftCode, rightCode }) {
  // Backwards compatibility - also support old insecure/secure props
  const left = leftCode || ''
  const right = rightCode || ''
  
  // Strip emojis from titles
  const leftHeader = stripEmojis(leftTitle) || 'Insecure Version'
  const rightHeader = stripEmojis(rightTitle) || 'Fixed Version'
  
  // Determine card type based on keywords (without emojis)
  const isLeftBad = leftHeader.toLowerCase().includes('insecure') || 
                    leftHeader.toLowerCase().includes('vulnerable') ||
                    leftHeader.toLowerCase().includes('dangerous') ||
                    leftHeader.toLowerCase().includes('false')
  const isRightGood = rightHeader.toLowerCase().includes('secure') || 
                      rightHeader.toLowerCase().includes('safe') || 
                      rightHeader.toLowerCase().includes('fixed')

  return (
    <div className="comparison-cards">
      <div className={`comparison-card ${isLeftBad ? 'insecure' : 'neutral'}`}>
        <div className="comparison-header">
          {isLeftBad ? <ShieldOff size={18} /> : <Info size={18} />}
          <span>{leftHeader}</span>
        </div>
        <div className="comparison-content">
          <pre><code>{left}</code></pre>
        </div>
      </div>
      <div className="comparison-arrow">
        <ArrowRight size={24} />
      </div>
      <div className={`comparison-card ${isRightGood ? 'secure' : 'neutral'}`}>
        <div className="comparison-header">
          {isRightGood ? <Shield size={18} /> : <Info size={18} />}
          <span>{rightHeader}</span>
        </div>
        <div className="comparison-content">
          <pre><code>{right}</code></pre>
        </div>
      </div>
    </div>
  )
}

// Flow diagram showing attack/data flow steps
export function FlowDiagram({ title, steps }) {
  return (
    <div className="flow-diagram-container">
      {title && <h4 className="flow-title">{title}</h4>}
      <div className="flow-diagram">
        {steps.map((step, index) => (
          <div key={index} className="flow-step-wrapper">
            <div className={`flow-step ${step.highlight ? 'highlight' : ''}`}>
              {step.icon && <span className="flow-icon">{step.icon}</span>}
              <span className="flow-label">{step.label}</span>
              {step.description && <span className="flow-note">{step.description}</span>}
              {step.note && <span className="flow-note">{step.note}</span>}
            </div>
            {index < steps.length - 1 && (
              <div className="flow-arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Highlight box for key concepts (HighlightBox)
export function HighlightBox({ variant = 'info', title, content, children }) {
  const icons = {
    warning: <AlertTriangle size={20} />,
    success: <CheckCircle size={20} />,
    danger: <XCircle size={20} />,
    info: <Lightbulb size={20} />
  }

  // Support both content prop and children
  const renderContent = () => {
    if (content) {
      // If content has newlines, split into paragraphs
      return content.split('\n').map((line, i) => (
        <p key={i}>{line}</p>
      ))
    }
    return children
  }

  return (
    <div className={`concept-box ${variant}`}>
      <div className="concept-header">
        {icons[variant]}
        <span>{title}</span>
      </div>
      <div className="concept-content">
        {renderContent()}
      </div>
    </div>
  )
}

// Legacy alias for backwards compatibility
export const ConceptBox = HighlightBox

// Styled code block with line-based highlights
export function CodeBlock({ title, code, highlights = [] }) {
  const lines = code.split('\n')
  
  // Build a map of line numbers to highlight types
  const lineHighlights = {}
  highlights.forEach(h => {
    if (h.lines) {
      h.lines.forEach(lineNum => {
        lineHighlights[lineNum] = h.type || 'danger'
      })
    }
  })

  return (
    <div className="code-block">
      {title && <div className="code-title">{title}</div>}
      <pre>
        <code>
          {lines.map((line, index) => {
            const lineNum = index + 1
            const highlightClass = lineHighlights[lineNum] ? `code-highlight ${lineHighlights[lineNum]}` : ''
            return (
              <span key={index} className={highlightClass}>
                {line}
                {index < lines.length - 1 ? '\n' : ''}
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

// Step-by-step attack flow
export function AttackFlow({ steps }) {
  return (
    <div className="attack-flow">
      {steps.map((step, index) => (
        <div key={index} className="attack-step">
          <div className="attack-step-number">{index + 1}</div>
          <div className="attack-step-content">
            <h4>{step.title}</h4>
            <p>{step.description}</p>
            {step.code && (
              <pre><code>{step.code}</code></pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Key takeaways list
export function KeyTakeaways({ items }) {
  return (
    <div className="key-takeaways">
      <h4>🎯 Key Takeaways</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
