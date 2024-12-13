import { Card } from "../reducers/gameReducer";
import { Dispatch } from "react";
import delay from "../utils/delay";

type GameControlsProps = {
  handCards: Card[];
  selectedCards: Card[];
  deckCards: Card[];
  dispatch: Dispatch<{ type: string; payload: unknown }>;
};

function GameControls({
  handCards,
  selectedCards,
  deckCards,
  dispatch,
}: GameControlsProps) {
  function drawCards(cards: number): Promise<void> {
    return new Promise((resolve) => {
      for (let i = 0; i < cards; i++) {
        setTimeout(() => {
          dispatch({
            type: "DRAW_CARD",
            payload: null,
          });

          // Resolve the promise after the last card is drawn
          if (i === cards - 1) {
            resolve();
          }
        }, i * 100);
      }
      // If no cards to draw, resolve immediately
      if (cards === 0) {
        resolve();
      }
    });
  }

  function discardCards(cards: Card[]): Promise<void> {
    return new Promise((resolve) => {
      let totalDiscarded = 0;
      for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
          dispatch({
            type: "DISCARD_CARD",
            payload: cards[cards.length - 1 - i],
          });
          totalDiscarded++;

          // Move the resolution check inside the timeout callback
          if (totalDiscarded === cards.length) {
            resolve();
          }
        }, i * 100);
      }

      // If no cards to discard, resolve immediately
      if (cards.length === 0) {
        resolve();
      }
    });
  }

  function playCards(cards: Card[]): Promise<void> {
    return new Promise((resolve) => {
      for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
          dispatch({
            type: "PLAY_CARD",
            payload: cards[i],
          });
          // Resolve the promise after the last card is played
          if (i === cards.length - 1) {
            resolve();
          }
        }, i * 100);
      }

      // If no cards to play, resolve immediately
      if (cards.length === 0) {
        resolve();
      }
    });
  }

  return (
    <div className="button-container">
      <button
        onClick={async () => {
          const selectedCards = handCards.filter((card) => card.selected);
          await playCards(selectedCards);
          await delay(500);
          await discardCards(selectedCards);
          await drawCards(selectedCards.length);
        }}
        disabled={selectedCards.length === 0}
      >
        Play Hand
      </button>
      <button
        onClick={async () => {
          const selectedCards = handCards.filter((card) => card.selected);
          await discardCards(selectedCards);
          await delay(200);
          await drawCards(selectedCards.length);
        }}
        disabled={selectedCards.length === 0}
      >
        Discard
      </button>
      <button
        onClick={async () => {
          dispatch({ type: "RESET", payload: null });
          dispatch({ type: "SHUFFLE_DECK", payload: null });
          await drawCards(5);
        }}
        disabled={deckCards.length !== 0}
      >
        Reset
      </button>
    </div>
  );
}

export default GameControls;
