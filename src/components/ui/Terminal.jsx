import './Terminal.css'

export default function Terminal({ 
  children, 
  title = 'Terminal',
  className = '' 
}) {
  return (
    <div className={`terminal ${className}`}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn red"></span>
          <span className="terminal-btn yellow"></span>
          <span className="terminal-btn green"></span>
        </div>
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">
        <pre className="terminal-content">{children}</pre>
      </div>
    </div>
  )
}
