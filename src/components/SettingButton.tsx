import React from 'react'
import type { SettingItem } from '../config/settings'

interface SettingButtonProps {
  setting: SettingItem
  onSelect: (setting: SettingItem) => void
}

const SettingButton: React.FC<SettingButtonProps> = ({ setting, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(setting)}
      className={`welcome-option welcome-option--${setting.key}`}
      style={{ ['--overlay-color' as any]: setting.color }}
    >
      <div className="welcome-option__overlay" aria-hidden />
      <div className="welcome-option__icon">{setting.icon}</div>
      <h3 className="welcome-option__name">{setting.name}</h3>
    </button>
  )
}

export default SettingButton