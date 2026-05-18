import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import './Flag.css'

// Extract the ALL-CAPS fragment word from flags like FLAG{WORD_rest_of_flag}
function extractFragment(flag) {
  const match = flag.match(/^FLAG\{([A-Z]+)_/)
  return match ? match[1] : null
}

export default function Flag({ flag }) {
  const [copied, setCopied] = useState(false)
  const fragment = extractFragment(flag)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(flag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flag-container">
      <div className="flag-content">
        <code className="flag-code">{flag}</code>
        <button
          className="flag-copy-btn"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      {fragment && (
        <p className="flag-fragment">Fragment unlocked: <strong>{fragment}</strong></p>
      )}
    </div>
  )
}
