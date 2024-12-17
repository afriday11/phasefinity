import { Card as CardType } from "../reducers/gameReducer";
import { Dispatch } from "react";
import useWindowSize from "../hooks/useWindowSize";
import Hand from "./Hand";

type GameBoardProps = {
  cardState: CardState;
  dispatch: Dispatch<{ type: string; payload: unknown }>;
};

type CardState = {
  handCards: CardType[];
  boardCards: CardType[];
  discardPile: CardType[];
  deckCards: CardType[];
  selectedCards: CardType[];
};

function GameBoard({ cardState, dispatch }: GameBoardProps) {
  useWindowSize();

  const handleCardClick = (card: CardType) => {
    dispatch({
      type: "TOGGLE_CARD_SELECTION",
      payload: { id: card.id },
    });
  };

  const cards = [
    ...Hand({
      cards: cardState.handCards,
      yOffset: 250,
      splayed: true,
      anchor: "bottom",
      onClick: handleCardClick,
    }),
    ...Hand({
      cards: cardState.boardCards,
      yOffset: 500,
      splayed: true,
      anchor: "bottom",
    }),
    ...Hand({ cards: cardState.discardPile, yOffset: -100, anchor: "top" }),
    ...Hand({ cards: cardState.deckCards, yOffset: 0, anchor: "bottom" }),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // This line is critical to allow React to animate the cards
  // it's not enough that they have the same key, they must be in the same order
  cards.sort((a: any, b: any) => a.key - b.key);

  return cards;
}

export default GameBoard;
