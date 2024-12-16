import { Card as CardType } from "../reducers/gameReducer";
import Card from "./Card";
import { Dispatch } from "react";
import useWindowSize from "../hooks/useWindowSize";

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

  function renderHand(
    cards: CardType[],
    yOffset: number,
    splayed: boolean = false,
    anchor: "top" | "bottom" = "top",
    onClick?: () => void
  ) {
    const cardWidth = 100;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenHalf = screenWidth / 2;
    const cardSpacing = Math.min((screenWidth * 0.666) / cards.length, 100);
    const xOffset = cardSpacing * (cards.length / 2);

    const anchoredYOffset = anchor === "top" ? yOffset : screenHeight - yOffset;

    // cards.sort((a, b) => b.value - a.value);
    // cards.sort((a, b) => a.suit.localeCompare(b.suit));

    return cards.map((card, index) => {
      const cardPosition = splayed
        ? index * cardSpacing + cardSpacing / 2 - xOffset
        : 0;

      // calc a card rotation based on its position from center
      const cardRotation = splayed ? cardPosition / (screenWidth / 50) : 0;

      // calc a parabolic y offset based on its position from center
      const archOffset = cardPosition * (cardPosition / (screenWidth * 2));

      const x = cardPosition + screenHalf - cardWidth / 2;
      const y = anchoredYOffset - (card.selected ? 40 : 0) + archOffset;
      return (
        <Card
          key={card.id}
          card={card}
          zIndex={index}
          position={{ x, y }}
          rotation={cardRotation}
          onClick={onClick}
        />
      );
    });
  }

  const handleCardClick = (card: CardType) => {
    dispatch({
      type: "TOGGLE_CARD_SELECTION",
      payload: { id: card.id },
    });
  };

  const cards = [
    ...renderHand(cardState.handCards, 250, true, "bottom", handleCardClick),
    ...renderHand(cardState.boardCards, 500, true, "bottom"),
    ...renderHand(cardState.discardPile, -100, false, "top"),
    ...renderHand(cardState.deckCards, 0, false, "bottom"),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cards.sort((a: any, b: any) => a.key - b.key);

  return cards;
}

export default GameBoard;
