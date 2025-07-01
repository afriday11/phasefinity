import { useState, useEffect } from 'react';
import './App.css'
import GameBoard from './components/GameBoard'
import GameControls from './components/GameControls'
import ScoreDisplay from './components/ScoreDisplay'
import { LevelDisplay } from './components/LevelDisplay'
// import LevelCompletionPopup from './components/LevelCompletionPopup' // Commented out - part of deprecated coin system
import JokerDisplay from './components/JokerDisplay'
import PowerupScreen from './components/PowerupScreen'
import { useAppContext } from './store/store'
// Import debug utilities for testing jokers
import { addTestJokers } from './utils/debugJokers'
import { generatePowerupOptions, applySelectedPowerup } from './services/powerupService'
import { Powerup } from './types/powerupTypes'

// App is the main component that renders the game.
// It uses the useAppContext hook to get the game state and dispatch actions.
// It also uses the GameBoard component to render the game board.
// It also uses the GameControls component to render the game controls.
// It also uses the ScoreDisplay component to render the score.
// It also uses the LevelDisplay component to render the level.
// It also uses the LevelCompletionPopup to show level completion results.

// COMMENTED OUT: PopupState interface (part of deprecated coin system)
// interface PopupState {
//   isVisible: boolean;
//   isWin: boolean;
//   level: number;
//   handsRemaining: number;
// }

function App() {
  const { state, dispatch } = useAppContext();
  const { score, level, game, powerup } = state;
  
  // COMMENTED OUT: Popup state (part of deprecated coin system)
  // const [popupState, setPopupState] = useState<PopupState>({
  //   isVisible: false,
  //   isWin: false,
  //   level: 1,
  //   handsRemaining: 0
  // });

  // Track level changes to show popup
  const [previousLevel, setPreviousLevel] = useState(level.currentLevel);
  const [previousGameOver, setPreviousGameOver] = useState(level.isGameOver);

  useEffect(() => {
    // Check if level just increased (level completion)
    if (level.currentLevel > previousLevel) {
      // COMMENTED OUT: Level completion popup for coins (deprecated for now)
      // const estimatedHandsRemaining = 2; // Temporary fixed value for testing
      // setPopupState({
      //   isVisible: true,
      //   isWin: true,
      //   level: previousLevel, // Show the level that was just completed
      //   handsRemaining: Math.max(0, estimatedHandsRemaining)
      // });
      
      // Generate powerups for the new level immediately (no delay needed now)
      setTimeout(async () => {
        const powerupOptions = await generatePowerupOptions(game.jokers, level.currentLevel);
        if (powerupOptions.length > 0) {
          dispatch({
            type: 'SHOW_POWERUPS',
            payload: { powerups: powerupOptions }
          });
        }
      }, 500); // Short delay to let level transition complete
    }

    // Check if game just ended (game over)
    if (level.isGameOver && !previousGameOver) {
      // COMMENTED OUT: Game over popup (part of coin system - deprecated for now)
      // setPopupState({
      //   isVisible: true,
      //   isWin: false,
      //   level: level.currentLevel,
      //   handsRemaining: 0
      // });
    }

    // Update previous states
    setPreviousLevel(level.currentLevel);
    setPreviousGameOver(level.isGameOver);
  }, [level.currentLevel, level.isGameOver, level.turnsRemaining, previousLevel, previousGameOver, dispatch, game.jokers]);

  // COMMENTED OUT: Handle continue function (part of deprecated coin system)
  // const handleContinue = () => {
  //   setPopupState(prev => ({ ...prev, isVisible: false }));
  // };

  // Powerup handlers
  const handleSelectPowerup = (selectedPowerup: Powerup) => {
    applySelectedPowerup(selectedPowerup, dispatch);
    dispatch({ type: 'SELECT_POWERUP', payload: { powerup: selectedPowerup } });
  };

  const handleSkipPowerups = () => {
    dispatch({ type: 'SKIP_POWERUPS' });
  };

  // Set up debug functions globally for console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Make debug functions available globally with proper dispatch context
      (window as typeof window & { 
        debugGame: {
          addTestJokers: () => void;
          state: typeof state;
          dispatch: typeof dispatch;
        }
      }).debugGame = {
        addTestJokers: () => addTestJokers(dispatch),
        state,
        dispatch
      };
      console.log('🔧 Debug utilities available: window.debugGame');
    }
  }, [dispatch, state]);

  // Trigger powerups for the first level when player actually starts playing (cards are dealt)
  useEffect(() => {
    const handCards = game.cards.filter(card => card.position === "hand");
    const hasCardsInHand = handCards.length > 0;
    
    // Trigger powerups when:
    // 1. Player has cards in hand (meaning they clicked "New Game")
    // 2. It's level 1 
    // 3. No powerup screen is currently showing
    // 4. No powerups have been generated yet
    if (hasCardsInHand && level.currentLevel === 1 && !powerup.isVisible && powerup.availablePowerups.length === 0) {
      setTimeout(async () => {
        const powerupOptions = await generatePowerupOptions(game.jokers, level.currentLevel);
        if (powerupOptions.length > 0) {
          dispatch({
            type: 'SHOW_POWERUPS',
            payload: { powerups: powerupOptions }
          });
        }
      }, 500); // Short delay to let cards finish dealing
    }
  }, [game.cards, level.currentLevel, powerup.isVisible, powerup.availablePowerups.length, dispatch, game.jokers]);

  return (
    <>
      <div className="title-container">
        <h1>Phasefinity</h1>
      </div>
      <ScoreDisplay score={score} />
      <LevelDisplay levelState={level} currentScore={score.currentScore} />
      <JokerDisplay equippedJokers={game.jokers} />
      <GameBoard />
      <GameControls />
      
      {/* COMMENTED OUT: Level completion popup (part of deprecated coin system) */}
      {/* <LevelCompletionPopup
        isVisible={popupState.isVisible}
        isWin={popupState.isWin}
        level={popupState.level}
        handsRemaining={popupState.handsRemaining}
        onContinue={handleContinue}
      /> */}
      
      <PowerupScreen
        isVisible={powerup.isVisible}
        availablePowerups={powerup.availablePowerups}
        onSelectPowerup={handleSelectPowerup}
        onSkip={handleSkipPowerups}
      />
    </>
  )
}

export default App 