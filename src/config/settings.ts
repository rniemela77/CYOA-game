export const SETTINGS = [
  { key: 'forest', name: 'Mystic Forest', icon: '🌲', color: '#2e7d32' },
  { key: 'urban', name: 'Neon City', icon: '🏢', color: '#00e5ff' },
  { key: 'space', name: 'Space Station', icon: '🚀', color: '#A07CCD' },
  { key: 'desert', name: 'Shifting Desert', icon: '🏜️', color: '#d4a373' },
  { key: 'mountain', name: 'High Mountains', icon: '🏔️', color: '#607d8b' },
  { key: 'ocean', name: 'Open Ocean', icon: '🌊', color: '#0288d1' },
  { key: 'dungeon', name: 'Forgotten Dungeon', icon: '🗝️', color: '#82675D' },
  { key: 'castle', name: 'Ancient Castle', icon: '🏰', color: '#9e9e9e' },
  { key: 'apocalypse', name: 'After the Fall', icon: '☣️', color: '#7cb342' },
  { key: 'steampunk', name: 'Steam City', icon: '⚙️', color: '#b87333' },
  { key: 'western', name: 'Dusty Frontier', icon: '🤠', color: '#d2691e' },
  { key: 'ancient', name: 'Ancient Ruins', icon: '🏛️', color: '#556b2f' },
  { key: 'arctic', name: 'Frozen Wastes', icon: '🧊', color: '#b3e5fc' },
  { key: 'island', name: 'Lost Island', icon: '🏝️', color: '#1abc9c' },
  { key: 'underworld', name: 'Underworld', icon: '🕳️', color: '#B9618D' },
 ] as const

export type SettingItem = typeof SETTINGS[number]
export type GameSetting = typeof SETTINGS[number]['key']


