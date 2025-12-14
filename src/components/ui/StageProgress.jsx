import './StageProgress.css'

export default function StageProgress({ stages, currentStage }) {
  return (
    <div className="stage-progress">
      {stages.map((label, index) => {
        const stageNum = index + 1
        const isActive = currentStage >= stageNum
        const isComplete = currentStage > stageNum
        
        return (
          <div key={stageNum} className="stage-item">
            {index > 0 && (
              <div className={`stage-line ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`} />
            )}
            <div className={`stage-dot ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
              {stageNum}
            </div>
            <span className={`stage-label ${isActive ? 'active' : ''}`}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
