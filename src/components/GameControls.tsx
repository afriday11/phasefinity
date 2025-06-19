import delay from "../utils/delay";
import { useAppContext } from '../store/store';
import { evaluateHand } from '../services/handEvaluator';
import { calculateScore } from '../services/scoreManager';
import { checkLevelComplete, checkGameOver } from '../services/levelService';
import { grantLevelCompletionCoins } from '../services/coinService';

// GameControls is the component that manages the game controls, including: 
// the play cards button, the discard cards button, and the reset game button.
// It also uses the useAppContext hook to get the game state and dispatch actions.
// It also uses the evaluateHand function to evaluate the hand.
// It also uses the calculateScore function to calculate the score.
// It also uses the delay function to delay the actions.
// LEVEL MANAGEMENT: This component now handles turn/discard tracking and level progression

function GameControls() {
  const { state, dispatch } = useAppContext();
  const { game, handLevels, score, level } = state;

  const handCards = game.cards.filter((card) => card.position === "hand");
  const deckCards = game.cards.filter((card) => card.position === "deck");
  const selectedCards = handCards.filter((card) => card.selected);

  const shouldReset = !handCards.length && !deckCards.length;
  const isDisabled = selectedCards.length === 0;
  const isGameOver = level.isGameOver;
  const canDiscard = level.discardsRemaining > 0 && !isGameOver;
  const canPlay = !isGameOver && level.turnsRemaining > 0;

  // Debug logging to help troubleshoot
  console.log("GameControls Debug:", {
    gameStarted: game.gameStarted,
    allowInput: game.allowInput,
    handCards: handCards.length,
    deckCards: deckCards.length,
    shouldReset,
    totalCards: game.cards.length,
    currentLevel: level.currentLevel,
    turnsRemaining: level.turnsRemaining,
    discardsRemaining: level.discardsRemaining,
    currentScore: score.currentScore,
    requiredScore: level.requiredScore,
    isGameOver,
    canDiscard,
    canPlay,
    note: "Note: Logs may appear twice due to React Strict Mode in development"
  });

  async function handlePlayCards() {
    const { handType } = evaluateHand(selectedCards);

    // All hands are valid - multiple cards with no pairs/combinations 
    // are treated as "highCard" and scored based on the highest card value

    // First, dispatch that the hand has been played to track stats.
    dispatch({ type: 'INCREMENT_TIMES_PLAYED', payload: { handType } });

    // Then, calculate the score for the hand.
    const calculation = calculateScore(handType, selectedCards, handLevels);

    // Update the score in the application state.
    dispatch({
      type: "UPDATE_SCORE",
      payload: {
        points: calculation.finalScore,
        handType: calculation.handType,
        chips: calculation.currentChips,
        multiplier: calculation.currentMultiplier,
        bonusDescription: calculation.bonuses,
      },
    });

    // FIXED: Use a turn when playing cards
    dispatch({ type: 'USE_TURN' });
    console.log("🎯 Used a turn - turns remaining:", level.turnsRemaining - 1);

    // Proceed with the card animations and state changes.
    dispatch({
      type: "PLAY_CARDS",
      payload: selectedCards,
    });
    await delay(selectedCards.length * 100 + 500);
    dispatch({
      type: "DISCARD_CARDS",
      payload: selectedCards,
    });
    await delay(selectedCards.length * 100 + 250);
    dispatch({
      type: "DRAW_CARDS",
      payload: selectedCards.length,
    });

    // FIXED: Check if level is complete after scoring
    // Calculate the new score (current score + points just earned)
    const newScore = score.currentScore + calculation.finalScore;
    
    if (checkLevelComplete(newScore, level.currentLevel)) {
      console.log("🎉 Level complete! Moving to next level...");
      
      // COINS: Grant coins for completing the level
      const handsRemaining = Math.max(0, level.turnsRemaining - 1); // Remaining after this turn
      console.log(`💰 Level completion details:`, {
        turnsRemaining: level.turnsRemaining,
        handsRemaining: handsRemaining,
        levelCompleted: level.currentLevel
      });
      grantLevelCompletionCoins(dispatch, handsRemaining);
      
      dispatch({ type: 'NEXT_LEVEL' });
      
      // FIXED: Reset everything for the new level
      console.log("🔄 Resetting for new level: score, board, and dealing new hand");
      dispatch({ type: 'RESET_SCORE' }); // Reset score to 0 for new level
      dispatch({ type: 'RESET' }); // Move all cards back to deck
      dispatch({ type: 'SHUFFLE_DECK' }); // Shuffle for variety
      dispatch({ type: 'DRAW_CARDS', payload: 8 }); // Deal fresh hand of 8 cards
    } else {
      // Check if game is over (no more turns and didn't reach required score)
      const turnsAfterUse = level.turnsRemaining - 1;
      if (checkGameOver(turnsAfterUse, newScore, level.requiredScore)) {
        console.log("💀 Game Over! Not enough turns to reach required score.");
        // No coins for game over
        dispatch({ type: 'GAME_OVER' });
      }
    }
  }

  function handleDiscardCards() {
    // FIXED: Check if discards are available before using one
    if (level.discardsRemaining <= 0) {
      console.log("❌ Cannot discard - no discards remaining!");
      return;
    }
    
    // FIXED: Use a discard when discarding cards
    dispatch({ type: 'USE_DISCARD' });
    console.log("🗑️ Used a discard - discards remaining:", level.discardsRemaining - 1);
    
    dispatch({
      type: "DISCARD_CARDS",
      payload: selectedCards,
    });
    dispatch({
      type: "DRAW_CARDS",
      payload: selectedCards.length,
    });
  }

  function handleResetGame() {
    console.log("🎮 New Game button clicked! Starting game...");
    dispatch({ type: "INITIALIZE_GAME" });
    dispatch({ type: "SHUFFLE_DECK" });
    dispatch({ type: 'RESET_LEVEL' });
    dispatch({ type: 'RESET_SCORE' });
    dispatch({ type: 'RESET_HAND_LEVELS' });
    dispatch({ type: 'RESET_ECONOMY' });
    dispatch({ type: "DRAW_CARDS", payload: 8 });
    console.log("🃏 Dealt 8 cards to hand");
  }

  function renderButtons() {
    // Show "New Game" button if game is over
    if (isGameOver) {
      return (
        <button onClick={handleResetGame}>
          Game Over - New Game
        </button>
      );
    }
    
    // Show "New Game" button if no cards in hand (need to deal initial hand)
    // or if both hand and deck are empty (complete reset needed)
    if (handCards.length === 0 || shouldReset) {
      return (
        <button onClick={handleResetGame}>
          {handCards.length === 0 && deckCards.length > 0 ? "New Game" : "New Round"}
        </button>
      );
    }
    
    // Show play/discard buttons if cards are in hand
    return (
      <>
        <button onClick={handlePlayCards} disabled={isDisabled || !canPlay}>
          Play Hand {level.turnsRemaining > 0 ? `(${level.turnsRemaining} turns left)` : '(No turns left)'}
        </button>

        <button onClick={handleDiscardCards} disabled={isDisabled || !canDiscard}>
          Discard {level.discardsRemaining > 0 ? `(${level.discardsRemaining} discards left)` : '(No discards left)'}
        </button>
      </>
    );
  }

  return (
    <div
      className="button-container"
      style={{
        bottom: game.allowInput ? 0 : -100,
      }}
    >
      {renderButtons()}
    </div>
  );
}

export default GameControls;
