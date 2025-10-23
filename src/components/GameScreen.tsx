import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/useStore'
import { generateScene } from '../services/aiService'

const GameScreen: React.FC = () => {
  const {
    gameStatus,
    currentTurn,
    selectedSetting,
    currentStory,
    backgroundColor,
    error,
    storyHistory,
    setCurrentStory,
    setLoading,
    setError,
    nextTurn,
    endGame,
    clearError
  } = useGameStore()

  const hasGeneratedStory = useRef(false)
  const storyContainerRef = useRef<HTMLDivElement>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const MAX_TURNS = 6

  // Reset the ref when game restarts
  useEffect(() => {
    if (gameStatus === 'welcome') {
      hasGeneratedStory.current = false
    }
  }, [gameStatus])

  // Auto-scroll to bottom when story content changes
  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight
    }
  }, [currentStory, storyHistory, gameStatus])

  // Generate initial story when game starts
  useEffect(() => {
    if (gameStatus === 'loading' && selectedSetting && !currentStory && !hasGeneratedStory.current) {
      hasGeneratedStory.current = true
      
      generateScene({ setting: selectedSetting })
        .then((storyData) => {
          setCurrentStory(storyData)
          clearError()
        })
        .catch((err) => {
          console.error('Error generating initial story:', err)
          setError(err.message)
          setLoading(false)
        })
    }
  }, [gameStatus, selectedSetting, currentStory, setCurrentStory, setLoading, setError, clearError])

  // Clear the selected option once loading completes
  useEffect(() => {
    if (gameStatus !== 'loading' && selectedOption) {
      setSelectedOption(null)
    }
  }, [gameStatus, selectedOption])

  const handleChoiceSelect = async (choice: string) => {
    if (!currentStory) return

    try {
      setSelectedOption(choice)
      setLoading(true)
      clearError()
      
      const nextStory = await generateScene({
        chosenOption: choice,
        lastSceneText: currentStory.text
      })
      
      // Add the choice to the current story before moving it to history
      setCurrentStory(nextStory, choice)
      nextTurn()
      
      // Check if we've reached the end of the story
      if (currentTurn + 1 >= MAX_TURNS) {
        console.log('🏁 STORY ENDING - Reached maximum length:', MAX_TURNS);
        setTimeout(() => endGame(), 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story continuation')
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div>
        <div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }


  if (!currentStory && gameStatus !== 'loading') {
    return (
      <div>
        <div>
          <h2>No story available</h2>
          <p>Something went wrong loading your adventure.</p>
        </div>
      </div>
    )
  }

  // Build a list of message cards from history + current story
  const renderMessageCards = () => {
    return (
      <div className="story-list">
        {storyHistory.map((entry) => (
          <React.Fragment key={entry.id}>
            <div className="message-card message-card--scene">
              <p>{entry.text}</p>
            </div>
            {entry.chosenOption && (
              <div className="message-choice">You chose: {entry.chosenOption}</div>
            )}
          </React.Fragment>
        ))}
        {currentStory && (
          <div className="message-card message-card--scene">
            <p>{currentStory.text}</p>
          </div>
        )}
        {gameStatus === 'loading' && selectedOption && (
          <div className="message-choice">You chose: {selectedOption}</div>
        )}
        {gameStatus === 'loading' && (
          <div className="message-card message-card--loading">
            <span>Generating your adventure</span>
            <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* background color overlay */}
      <div className="color-overlay" style={{ backgroundColor }}></div>

      {/* story container */}
      <div>
        <div className="game-layout">
          <div 
            ref={storyContainerRef}
            className="story-container"
          >
            {renderMessageCards()}
          </div>
          
          <div className="options-container">
            {currentStory && currentStory.options.map((option: string, index: number) => (
              <button
                className={`game-option-button ${
                  gameStatus === 'loading' && selectedOption && selectedOption !== option ? 'option--dimmed' : ''
                } ${
                  gameStatus === 'loading' && selectedOption === option ? 'option--active-loading' : ''
                }`}
                key={index}
                onClick={() => handleChoiceSelect(option)}
                disabled={gameStatus === 'loading'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
