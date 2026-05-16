import { Check } from 'lucide-react'
import './StageProgress.css'

export default function StageProgress({ stages, currentStage }) {
  return (
    <div className="stage-progress">
      {stages.flatMap((label, index) => {
        const stageNum = index + 1
        const isComplete = currentStage > stageNum
        const isActive = currentStage === stageNum
        const items = []

        if (index > 0) {
          items.push(
            <div
              key={`conn-${stageNum}`}
              className={`sp-connector${currentStage > index ? ' filled' : ''}`}
            />
          )
        }

        items.push(
          <div
            key={stageNum}
            className={`sp-step${isActive ? ' active' : ''}${isComplete ? ' complete' : ''}`}
          >
            <div className="sp-dot">
              {isComplete ? <Check size={12} strokeWidth={3} /> : stageNum}
            </div>
            <span className="sp-label">{label}</span>
          </div>
        )

        return items
      })}
    </div>
  )
}
