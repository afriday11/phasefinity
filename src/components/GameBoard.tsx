import { Card as CardType } from "../reducers/gameReducer";
import { Dispatch } from "react";
import useWindowSize from "../hooks/useWindowSize";
import Card from "./Card";
import useMousePosition from "../hooks/useMousePosition";

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

  // one stupid consequence of rendering this way is vite doesn't hot reload the hand
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

  return <>{cards}</>;
}

type HandProps = {
  cards: CardType[];
  yOffset: number;
  splayed?: boolean;
  anchor?: "top" | "bottom";
  onClick?: (card: CardType) => void;
};

// we're keeping the definition here so that we can hot reload the hand component
// we rendering in a really dumb way in the Gameboard so we can sort by key
function Hand({
  cards,
  yOffset,
  splayed = false,
  anchor = "top",
  onClick,
}: HandProps) {
  const cardLength = cards.length + 0;
  const cardWidth = 100;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenHalf = screenWidth / 2;
  const cardSpacing = Math.min((screenWidth * 0.666) / cardLength, 100);
  const xOffset = cardSpacing * (cardLength / 2);

  const mousePosition = useMousePosition();
  const mouseXcardIndex = Math.max(
    0,
    Math.floor(
      (mousePosition.x + cardSpacing * (cardLength / 2) - screenHalf) /
        cardSpacing
    )
  );

  const anchoredYOffset = anchor === "top" ? yOffset : screenHeight - yOffset;

  // cards = cards.sort((a, b) => a.value - b.value);

  // create a new array and insert a blank card at the mouseXcardIndex
  const newCards = [...cards];
  newCards.splice(mouseXcardIndex, 0, { id: null, value: 0 });

  return cards.map((card, index) => {
    const cardPosition = splayed
      ? index * cardSpacing + cardSpacing / 2 - xOffset
      : 0;

    const cardRotation = splayed ? cardPosition / (screenWidth / 50) : 0;
    const archOffset = cardPosition * (cardPosition / (screenWidth * 2));

    const x = cardPosition + screenHalf - cardWidth / 2;
    const y = anchoredYOffset - (card.selected ? 40 : 0) + archOffset;

    if (card.id === null) {
      return <div style={{ position: "absolute", left: x, top: y }} />;
    }

    return (
      <Card
        key={card.id}
        card={card}
        zIndex={index}
        position={{ x, y }}
        rotation={cardRotation + 0}
        onClick={onClick}
      />
    );
  });
}

export default GameBoard;
