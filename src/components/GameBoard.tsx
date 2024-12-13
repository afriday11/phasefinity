import { Card as CardType } from "../App";
import Card from "./Card";
import { Dispatch } from "react";

type GameBoardProps = {
  handCards: CardType[];
  boardCards: CardType[];
  discardPile: CardType[];
  deckCards: CardType[];
  dispatch: Dispatch<{ type: string; payload: unknown }>;
};

function GameBoard({
  handCards,
  boardCards,
  discardPile,
  deckCards,
  dispatch,
}: GameBoardProps) {
  function renderHand(
    cards: CardType[],
    top: number,
    splayed: boolean = false
  ) {
    const cardWidth = 100;
    const screenWidth = window.innerWidth;
    const screenHalf = screenWidth / 2;
    const cardSpacing = Math.min((screenWidth * 0.666) / cards.length, 100);
    const cardOffset = cardSpacing * (cards.length / 2);

    return cards.map((card, index) => {
      const cardPosition = splayed
        ? index * cardSpacing + cardSpacing / 2 - cardOffset
        : 0;

      // calc a card rotation based on its position from center
      const cardRotation = splayed ? cardPosition / (screenWidth / 50) : 0;

      // calc a parabolic y offset based on its position from center
      const yOffset = cardPosition * (cardPosition / (screenWidth * 2));

      const x = cardPosition + screenHalf - cardWidth / 2;
      const y = top - (card.selected ? 40 : 0) + yOffset;
      return (
        <Card
          key={card.id}
          card={card}
          zIndex={index}
          position={{ x, y }}
          rotation={cardRotation}
          onClick={() =>
            dispatch({
              type: "TOGGLE_CARD_SELECTION",
              payload: { id: card.id },
            })
          }
        />
      );
    });
  }

  const cards = [
    ...renderHand(handCards, 600, true),
    ...renderHand(boardCards, 300, true),
    ...renderHand(discardPile, -200),
    ...renderHand(deckCards, 900),
  ];

  cards.sort((a: any, b: any) => a.key - b.key);

  return cards;
}

export default GameBoard;
