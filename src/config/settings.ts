export const SETTINGS = [
  { key: 'forest', name: 'Mystic Forest', icon: '🌲' },
  { key: 'urban', name: 'Neon City', icon: '🏢' },
  { key: 'space', name: 'Space Station', icon: '🚀' },
  { key: 'desert', name: 'Shifting Desert', icon: '🏜️' },
  { key: 'mountain', name: 'High Mountains', icon: '🏔️' },
  { key: 'ocean', name: 'Open Ocean', icon: '🌊' },
  { key: 'dungeon', name: 'Forgotten Dungeon', icon: '🗝️' },
  { key: 'castle', name: 'Ancient Castle', icon: '🏰' },
  { key: 'apocalypse', name: 'After the Fall', icon: '☣️' },
  { key: 'steampunk', name: 'Steam City', icon: '⚙️' },
  { key: 'western', name: 'Dusty Frontier', icon: '🤠' },
  { key: 'ancient', name: 'Ancient Ruins', icon: '🏛️' },
  { key: 'arctic', name: 'Frozen Wastes', icon: '🧊' },
  { key: 'island', name: 'Lost Island', icon: '🏝️' },
  { key: 'underworld', name: 'Underworld', icon: '🕳️' },
 ] as const

export type SettingItem = typeof SETTINGS[number]
export type GameSetting = typeof SETTINGS[number]['key']


