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
      icon: '🏢'
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
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '0' }}>Chuzapath</h1>
        <i className="text-muted">Choose Your Own Adventure</i>
        <p style={{ margin: '1rem 0 2rem 0', display: 'block', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          Embark on an AI-generated journey where every choice shapes your destiny. 
          Each setting offers unique challenges, mysterious items, and branching paths.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {settings.map((setting) => (
            <button
              key={setting.key}
              onClick={() => handleSettingSelect(setting.key)}
              style={{ textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem', cursor: 'pointer', flexWrap: 'wrap' }}
            >
              <div style={{ fontSize: '2rem', filter: 'saturate(0) contrast(0)' }}>{setting.icon}</div>
              <h3>{setting.name}</h3>
              <p style={{ margin: '0' }}>{setting.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
