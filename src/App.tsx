import { useGameStore } from './store/useStore'
import WelcomeScreen from './components/WelcomeScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'

function App() {
  const { gameStatus } = useGameStore()

  const renderCurrentScreen = () => {
    switch (gameStatus) {
      case 'welcome':
        return <WelcomeScreen />
      case 'playing':
      case 'loading':
        return <GameScreen />
      case 'ended':
        return <EndScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <div>
      {renderCurrentScreen()}
    </div>
  )
}

export default App
