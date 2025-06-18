import './App.css'
import GameBoard from './components/GameBoard'
import GameControls from './components/GameControls'
import ScoreDisplay from './components/ScoreDisplay'
import { LevelDisplay } from './components/LevelDisplay'
import { useAppContext } from './store/store'

function App() {
  const { state } = useAppContext();
  const { score, level } = state;

  return (
    <>
      <div className="title-container">
        <h1>Phasefinity</h1>
        <ScoreDisplay score={score} />
        <LevelDisplay levelState={level} currentScore={score.currentScore} />
      </div>
      <GameBoard />
      <GameControls />
    </>
  )
}

export default App 