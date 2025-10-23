import React, { useEffect, useRef } from 'react'
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

  const handleChoiceSelect = async (choice: string) => {
    if (!currentStory) return

    try {
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

  // Combine story history with current story
  const getCombinedStoryText = () => {
    let combinedText = ''
    
    // Add all story history entries
    storyHistory.forEach((entry) => {
      if (entry.text) {
        combinedText += `\n${entry.text}\n`
        
        if (entry.chosenOption) {
          combinedText += `\n\nYou chose: ${entry.chosenOption}\n`
        }
      }
    })
    
    // Add current story
    if (currentStory) {
      combinedText += `\n${currentStory.text}\n`
    }
    
    // Add loading message if currently loading
    if (gameStatus === 'loading') {
      if (currentStory) {
        combinedText += `\n\n--- Generating your adventure... ---`
      } else {
        combinedText = `--- Generating... ---`
      }
    }
    
    return combinedText.trim()
  }

  return (
    <div>
      {/* background color overlay */}
      <div style={{position:'fixed', top: '0px', right: '0px', zIndex: 10, width: '100vw', height: '100vh', backgroundColor, transition: 'background-color 3.5s ease', opacity: '0.8', mixBlendMode: 'color-burn', pointerEvents: 'none'}}></div>

      {/* story container */}
      <div>
        <div style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)'}}>
          <div 
            ref={storyContainerRef}
            style={{
              flex: '1',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '16px',
              backgroundColor: '#F9F9F992',
              borderRadius: '8px',
              marginBottom: '16px',
              whiteSpace: 'pre-wrap',
              fontSize: '18px',
              lineHeight: '1.8'
            }}
          >
            {getCombinedStoryText()}
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {currentStory && currentStory.options.map((option: string, index: number) => (
              <button
                className="game-option-button"
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
