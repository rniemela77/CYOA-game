import React from 'react'
import { useGameStore } from '../store/useStore'
import type { SettingItem } from '../config/settings'
import { SETTINGS } from '../config/settings'
import SettingButton from './SettingButton'

const WelcomeScreen: React.FC = () => {
  const { startGame } = useGameStore()

  const settings = SETTINGS

  const handleSettingSelect = (setting: SettingItem) => {
    startGame(setting.key)
  }

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', margin: '3rem 0 1.5rem' }}>Choose a setting for your adventure:</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {settings.map((setting) => (
            <SettingButton
              key={setting.key}
              setting={setting}
              onSelect={handleSettingSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
