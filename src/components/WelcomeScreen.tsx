import React from 'react'
import { useGameStore } from '../store/useStore'
import { GameSetting } from '../services/aiService'

const WelcomeScreen: React.FC = () => {
  const { startGame } = useGameStore()

  const settings: Array<{ key: GameSetting; name: string; description: string; icon: string }> = [
    {
      key: 'forest',
      name: 'Mystic Forest',
      description: 'Ancient woods where magic whispers through the trees',
      icon: '🌲'
    },
    {
      key: 'urban',
      name: 'Neon City',
      description: 'A cyberpunk metropolis of shadows and secrets',
      icon: '🏙️'
    },
    {
      key: 'space',
      name: 'Space Station',
      description: 'A floating outpost where the stars hold mysteries',
      icon: '🚀'
    }
  ]

  const handleSettingSelect = (setting: GameSetting) => {
    startGame(setting)
  }

  return (
    <div>
      <div>
        <h1>Chuzapath</h1>
        <p>Choose Your Own Adventure</p>
        <p>
          Embark on an AI-generated journey where every choice shapes your destiny. 
          Each setting offers unique challenges, mysterious items, and branching paths.
        </p>
        
        <div>
          {settings.map((setting) => (
            <button
              key={setting.key}
              onClick={() => handleSettingSelect(setting.key)}
            >
              <div>{setting.icon}</div>
              <h3>{setting.name}</h3>
              <p>{setting.description}</p>
            </button>
          ))}
        </div>
        
        <div>
          <p>✨ Each adventure is unique and AI-generated</p>
          <p>🎒 You'll receive a special item with hidden powers</p>
          <p>📖 Stories are 8-12 turns with meaningful choices</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
