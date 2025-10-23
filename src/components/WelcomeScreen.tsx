import React from 'react'
import { useGameStore } from '../store/useStore'
import type { GameSetting } from '../config/settings'
import { SETTINGS } from '../config/settings'

const WelcomeScreen: React.FC = () => {
  const { startGame } = useGameStore()

  const settings = SETTINGS

  const handleSettingSelect = (setting: GameSetting) => {
    startGame(setting)
  }

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '0' }}>Chuzapath</h1>
        <i className="text-muted">Choose Your Own Adventure</i>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {settings.map((setting) => (
            <button
              key={setting.key}
              onClick={() => handleSettingSelect(setting.key)}
              style={{ position: 'relative', flex: '1 1 150px', overflow: 'hidden', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
            >
              <div style={{ fontSize: '6rem', opacity: 0.2, filter: 'saturate(0) contrast(0)', position: 'absolute', left: '0', bottom: '-30px' }}>{setting.icon}</div>
              <h3 style={{ textShadow: '0px 0px 3px #00000069', zIndex: 10, fontSize: '1.1rem' }}>{setting.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
