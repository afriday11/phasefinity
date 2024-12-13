import { Card } from "../reducers/gameReducer";
import { Dispatch } from "react";
import delay from "../utils/delay";
import playSound from "../utils/playDealSound";

type GameControlsProps = {
  gameStarted: boolean;
  handCards: Card[];
  selectedCards: Card[];
  deckCards: Card[];
  dispatch: Dispatch<{ type: string; payload: unknown }>;
};

function GameControls({
  gameStarted,
  handCards,
  selectedCards,
  deckCards,
  dispatch,
}: GameControlsProps) {
  function drawCards(cards: number): Promise<void> {
    return new Promise((resolve) => {
      // this is a bit of a hack because when we automatically
      // reset the game, the deck isn't full yet in this closure
      // but we know it will be once the dispatch has been sent.
      // but we also want to ensure we dont play sounds when
      // there are no cards to draw before a reset.
      const count =
        deckCards.length > 0 || handCards.length > 0
          ? Math.min(cards, deckCards.length)
          : cards;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          playSound();
          dispatch({
            type: "DRAW_CARD",
            payload: null,
          });

          if (i === cards - 1) {
            resolve();
          }
        }, i * 100);
      }
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
          playSound();
          dispatch({
            type: "DISCARD_CARD",
            payload: cards[cards.length - 1 - i],
          });
          totalDiscarded++;

          if (totalDiscarded === cards.length) {
            resolve();
          }
        }, i * 100);
      }

      if (cards.length === 0) {
        resolve();
      }
    });
  }

  function playCards(cards: Card[]): Promise<void> {
    return new Promise((resolve) => {
      for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
          playSound();
          dispatch({
            type: "PLAY_CARD",
            payload: cards[i],
          });
          if (i === cards.length - 1) {
            resolve();
          }
        }, i * 100);
      }

      if (cards.length === 0) {
        resolve();
      }
    });
  }

  function renderButtons() {
    return (
      <>
        <button
          onClick={async () => {
            const selectedCards = handCards.filter((card) => card.selected);
            await playCards(selectedCards);
            await delay(500);
            await discardCards(selectedCards);
            await delay(250);
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
            dispatch({ type: "INITIALIZE_GAME", payload: null });
            dispatch({ type: "SHUFFLE_DECK", payload: null });
            await drawCards(5);
          }}
          disabled={!canReset}
        >
          {gameStarted ? "Reset" : "New Game"}
        </button>
      </>
    );
  }

  return <div className="button-container">{renderButtons()}</div>;
}

export default GameControls;
