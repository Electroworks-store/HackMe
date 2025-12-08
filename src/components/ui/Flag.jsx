import { useState } from 'react'
import { Flag as FlagIcon, Copy, Check } from 'lucide-react'
import './Flag.css'

export default function Flag({ flag, title = 'Challenge Complete!' }) {
  const [copied, setCopied] = useState(false)

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
      <div className="flag-header">
        <FlagIcon size={24} className="flag-icon" />
        <h3 className="flag-title">{title}</h3>
      </div>
      
      <div className="flag-content">
        <code className="flag-code">{flag}</code>
        <button 
          className="flag-copy-btn"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      
      <p className="flag-note">
        Save this flag as proof of completion!
      </p>
    </div>
  )
}
