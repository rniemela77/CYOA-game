import { Routes, Route } from 'react-router-dom'
import { useGameStore } from './store/useStore'
import WelcomeScreen from './components/WelcomeScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import Header from './components/Header'
import About from './components/About'

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
      <Header />
      <Routes>
        <Route path="/" element={<div>{renderCurrentScreen()}</div>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App
