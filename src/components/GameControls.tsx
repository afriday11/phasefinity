import { Card } from "../reducers/gameReducer";
import { Dispatch } from "react";
import delay from "../utils/delay";
import { evaluateHand } from "../services/scoreService";

type GameControlsProps = {
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
  gameStarted,
  cardState,
  dispatch,
  scoreDispatch,
}: GameControlsProps) {
  const { selectedCards } = cardState;

  async function handlePlayCards() {
    const evaluation = evaluateHand(selectedCards);
    scoreDispatch({
      type: "UPDATE_SCORE",
      payload: {
        points: evaluation.score,
        handType: evaluation.handType,
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
    return (
      <>
        <button //prettier-ignore
          onClick={handlePlayCards}
          disabled={selectedCards.length === 0}
        >
          Play Hand
        </button>

        <button
          onClick={handleDiscardCards}
          disabled={selectedCards.length === 0}
        >
          Discard
        </button>

        <button
          onClick={handleResetGame}
          // disabled={!canReset}
        >
          {gameStarted ? "Reset" : "New Game"}
        </button>
      </>
    );
  }

  return <div className="button-container">{renderButtons()}</div>;
}

export default GameControls;
