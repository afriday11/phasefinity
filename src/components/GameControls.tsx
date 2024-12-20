import { Card } from "../reducers/gameReducer";
import { Dispatch } from "react";
import delay from "../utils/delay";
import { evaluateHand } from "../services/scoreService";

type GameControlsProps = {
  disabled: boolean;
  isDealing: boolean;
  gameStarted: boolean;
  cardState: CardState;
  dispatch: Dispatch<{ type: string; payload: unknown }>;
  scoreDispatch: Dispatch<{ type: string; payload: unknown }>;
};

type CardState = {
  handCards: Card[];
  boardCards: Card[];
  discardPile: Card[];
  deckCards: Card[];
  selectedCards: Card[];
};

function GameControls({
  disabled,
  isDealing,
  gameStarted,
  cardState,
  dispatch,
  scoreDispatch,
}: GameControlsProps) {
  const { selectedCards, handCards, deckCards } = cardState;

  const shouldReset = !handCards.length && !deckCards.length;
  const isDisabled = selectedCards.length === 0; // || isDealing;

  async function handlePlayCards() {
    const evaluation = evaluateHand(selectedCards);
    scoreDispatch({
      type: "UPDATE_SCORE",
      payload: {
        points: evaluation.score,
        handType: evaluation.handType,
        chips: evaluation.calculation.currentChips,
        multiplier: evaluation.calculation.currentMultiplier,
        bonusDescription: evaluation.calculation.bonuses
      },
    });
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
  }

  function handleDiscardCards() {
    // since we're not operating on the actual card state, we need to check if we're
    // dealing cards so we dont allow discarding the same cards multiple times
    if (isDealing) return;

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
    dispatch({ type: "INITIALIZE_GAME", payload: null });
    dispatch({ type: "SHUFFLE_DECK", payload: null });
    dispatch({ type: "DRAW_CARDS", payload: 8 });
  }

  function renderButtons() {
    if (shouldReset || !gameStarted)
      return (
        <button onClick={handleResetGame}>
          {gameStarted ? "Reset" : "New Game"}
        </button>
      );
    return (
      <>
        <button //prettier-ignore
          onClick={handlePlayCards}
          disabled={isDisabled}
        >
          Play Hand
        </button>

        <button onClick={handleDiscardCards} disabled={isDisabled}>
          Discard
        </button>

        {renderResetButton()}
      </>
    );
  }

  function renderResetButton() {
    if ((handCards.length || deckCards.length) && gameStarted) return null;
    return (
      <button onClick={handleResetGame}>
        {gameStarted ? "Reset" : "New Game"}
      </button>
    );
  }

  return (
    <div
      className="button-container"
      style={{
        // opacity: disabled ? 0.5 : 1,
        bottom: disabled ? 0 : -100,
      }}
    >
      {renderButtons()}
    </div>
  );
}

export default GameControls;
