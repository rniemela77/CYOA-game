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
        <i className="text-muted">Choose Your Own Adventure</i>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {settings.map((setting) => (
            <button
              key={setting.key}
              onClick={() => handleSettingSelect(setting.key)}
              className={`welcome-option welcome-option--${setting.key}`}
              style={{ ['--overlay-color' as any]: (setting as any).color }}
            >
              <div className="welcome-option__overlay" aria-hidden />
              <div className="welcome-option__icon">{setting.icon}</div>
              <h3 className="welcome-option__name">{setting.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
