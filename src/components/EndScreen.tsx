import React from 'react'
import { useGameStore } from '../store/useStore'

const EndScreen: React.FC = () => {
  const { restartGame, selectedSetting, currentTurn, storySkeleton } = useGameStore()

  const getEndingMessage = () => {
    if (!storySkeleton) return "Your adventure has concluded."
    
    if (currentTurn >= storySkeleton.length) {
      return "You have reached the end of your journey. The story has been told, and your choices have shaped the outcome."
    }
    
    return "Your adventure has come to an unexpected end."
  }

  const getSettingName = (setting: string | null) => {
    switch (setting) {
      case 'forest': return 'Mystic Forest'
      case 'urban': return 'Neon City'
      case 'space': return 'Space Station'
      default: return 'Unknown Realm'
    }
  }

  return (
    <div>
      <div>
        <div>🏁</div>
        <h1>Adventure Complete</h1>
        <p>{getEndingMessage()}</p>
        
        <div>
          <div>
            <span>Setting</span>
            <span>{getSettingName(selectedSetting)}</span>
          </div>
          <div>
            <span>Turns Completed</span>
            <span>{currentTurn}</span>
          </div>
          <div>
            <span>Total Turns</span>
            <span>{storySkeleton?.length || 'Unknown'}</span>
          </div>
        </div>
        
        <div>
          <button onClick={restartGame}>
            Start New Adventure
          </button>
        </div>
        
        <div>
          <p>✨ Each playthrough generates a unique story with different choices and outcomes</p>
          <p>🎲 Try different settings to experience completely different adventures</p>
        </div>
      </div>
    </div>
  )
}

export default EndScreen
