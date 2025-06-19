import { useState, useEffect } from 'react';
import './App.css'
import GameBoard from './components/GameBoard'
import GameControls from './components/GameControls'
import ScoreDisplay from './components/ScoreDisplay'
import { LevelDisplay } from './components/LevelDisplay'
import LevelCompletionPopup from './components/LevelCompletionPopup'
import { useAppContext } from './store/store'

// App is the main component that renders the game.
// It uses the useAppContext hook to get the game state and dispatch actions.
// It also uses the GameBoard component to render the game board.
// It also uses the GameControls component to render the game controls.
// It also uses the ScoreDisplay component to render the score.
// It also uses the LevelDisplay component to render the level.
// It also uses the LevelCompletionPopup to show level completion results.

interface PopupState {
  isVisible: boolean;
  isWin: boolean;
  level: number;
  handsRemaining: number;
}

function App() {
  const { state } = useAppContext();
  const { score, level } = state;
  
  const [popupState, setPopupState] = useState<PopupState>({
    isVisible: false,
    isWin: false,
    level: 1,
    handsRemaining: 0
  });

  // Track level changes to show popup
  const [previousLevel, setPreviousLevel] = useState(level.currentLevel);
  const [previousGameOver, setPreviousGameOver] = useState(level.isGameOver);

  useEffect(() => {
    // Check if level just increased (level completion)
    if (level.currentLevel > previousLevel) {
      // When level increases, the new level has full turns (4)
      // So we need to calculate what the hands remaining were in the previous level
      // This is tricky because we don't have the previous level state
      // For now, let's use a simple approach: assume they had some hands remaining
              const estimatedHandsRemaining = 2; // Temporary fixed value for testing
      
      setPopupState({
        isVisible: true,
        isWin: true,
        level: previousLevel, // Show the level that was just completed
        handsRemaining: Math.max(0, estimatedHandsRemaining)
      });
    }

    // Check if game just ended (game over)
    if (level.isGameOver && !previousGameOver) {
      setPopupState({
        isVisible: true,
        isWin: false,
        level: level.currentLevel,
        handsRemaining: 0
      });
    }

    // Update previous states
    setPreviousLevel(level.currentLevel);
    setPreviousGameOver(level.isGameOver);
  }, [level.currentLevel, level.isGameOver, level.turnsRemaining, previousLevel, previousGameOver]);

  const handleContinue = () => {
    setPopupState(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <>
      <div className="title-container">
        <h1>Phasefinity</h1>
        <ScoreDisplay score={score} />
        <LevelDisplay levelState={level} currentScore={score.currentScore} />
      </div>
      <GameBoard />
      <GameControls />
      
      <LevelCompletionPopup
        isVisible={popupState.isVisible}
        isWin={popupState.isWin}
        level={popupState.level}
        handsRemaining={popupState.handsRemaining}
        onContinue={handleContinue}
      />
    </>
  )
}

export default App 