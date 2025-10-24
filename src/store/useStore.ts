import { create } from 'zustand'
import { SceneData } from '../services/aiService'
import type { GameSetting } from '../config/settings'
import { StoryEntry } from '../types/story'

// Game state types
export type GameStatus = 'welcome' | 'playing' | 'ended' | 'loading'

interface GameState {
  // Game Status
  gameStatus: GameStatus
  currentTurn: number
  selectedSetting: GameSetting | null
  
  // Story Data
  currentStory: SceneData | null
  storyHistory: StoryEntry[]
  
  // UI State
  backgroundColor: string
  
  // Error handling
  error: string | null

  // Actions
  startGame: (setting: GameSetting) => void
  makeChoice: (choice: string) => void
  setCurrentStory: (story: SceneData, chosenOption?: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setBackgroundColor: (color: string) => void
  nextTurn: () => void
  endGame: () => void
  restartGame: () => void
  clearError: () => void
  addStoryEntry: (entry: StoryEntry) => void
}

// Create the game store
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  gameStatus: 'welcome',
  currentTurn: 0,
  selectedSetting: null,
  currentStory: null,
  storyHistory: [],
  backgroundColor: '#1a1a1a',
  error: null,

  // Actions
  startGame: (setting: GameSetting) => set({
    gameStatus: 'loading',
    selectedSetting: setting,
    currentTurn: 1,
    error: null
  }),

  makeChoice: () => {
    const state = get()
    if (state.currentStory) {
      set({ gameStatus: 'loading' })
      // This will be handled by the component that calls the AI service
    }
  },

  setCurrentStory: (story: SceneData, chosenOption?: string) => set((state) => {
    // Move previous story to history if it exists
    let newHistory = [...state.storyHistory]
    if (state.currentStory) {
      const previousEntry: StoryEntry = {
        id: `story-${Date.now()}-${Math.random()}`,
        text: state.currentStory.text,
        chosenOption: chosenOption,
        turn: state.currentTurn - 1,
        timestamp: new Date()
      }
      newHistory = [...newHistory, previousEntry]
    }
    
    return {
      currentStory: story,
      backgroundColor: story.backgroundColor,
      gameStatus: 'playing',
      storyHistory: newHistory
    }
  }),

  // Removed setStorySkeleton (no longer used)

  setLoading: (loading: boolean) => set({
    gameStatus: loading ? 'loading' : 'playing'
  }),

  setError: (error: string | null) => set({ error }),

  setBackgroundColor: (backgroundColor: string) => set({ backgroundColor }),

  nextTurn: () => set((state) => ({
    currentTurn: state.currentTurn + 1
  })),

  endGame: () => set({
    gameStatus: 'ended'
  }),

  restartGame: () => set({
    gameStatus: 'welcome',
    currentTurn: 0,
    selectedSetting: null,
    currentStory: null,
    storyHistory: [],
    backgroundColor: '#1a1a1a',
    error: null
  }),

  clearError: () => set({ error: null }),

  addStoryEntry: (entry: StoryEntry) => set((state) => ({
    storyHistory: [...state.storyHistory, entry]
  }))
}))