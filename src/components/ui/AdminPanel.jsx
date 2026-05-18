import { ShieldAlert } from 'lucide-react'
import './AdminPanel.css'

export default function AdminPanel({ title, subtitle, locked, children }) {
  return (
    <div className="admin-panel-ui">
      {title && (
        <div className="admin-panel-header">
          <ShieldAlert size={15} className="admin-panel-icon" />
          <span className="admin-panel-title">{title}</span>
          {locked !== undefined && (
            <span className={`admin-panel-badge ${locked ? 'locked' : 'unlocked'}`}>
              {locked ? 'Locked' : 'Unlocked'}
            </span>
          )}
        </div>
      )}
      {subtitle && <p className="admin-panel-subtitle">{subtitle}</p>}
      <div className="admin-panel-body">
        {children}
      </div>
    </div>
  )
}
