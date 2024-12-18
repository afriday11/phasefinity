import { Card as CardType } from "../reducers/gameReducer";
import { Dispatch, useEffect, useState } from "react";
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

  const [dragging, setDragging] = useState<{
    card: CardType;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    dragging: boolean;
  } | null>(null);

  const { x: mouseX, y: mouseY } = useMousePosition();

  const anchoredYOffset = anchor === "top" ? yOffset : screenHeight - yOffset;

  const handleMouseDown = (
    card: CardType,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    // e.preventDefault();

    // get bounding client rect
    const rect = e.currentTarget.getBoundingClientRect();

    // get position of mouse relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragging({ card, offsetX: x, offsetY: y, x, y, dragging: false });
    onClick?.(card);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    function handleMouseMove(e: MouseEvent) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragging((dragging: any) => ({
        ...dragging,
        dragging: true,
        x: x - e.movementX,
        y: y - e.movementY,
      }));
    }

    function handleMouseUp() {
      setDragging(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  };

  // cards = cards.sort((a, b) => a.value - b.value);

  return cards.map((card, index) => {
    const cardPosition = splayed
      ? index * cardSpacing + cardSpacing / 2 - xOffset
      : 0;

    const archOffset = cardPosition * (cardPosition / (screenWidth * 2));

    let x = cardPosition + screenHalf - cardWidth / 2;
    let y = anchoredYOffset + archOffset;

    const isDragging = dragging?.card?.id === card.id && dragging?.dragging;
    if (isDragging) {
      x += dragging.x - dragging.offsetX;
      y += dragging.y - dragging.offsetY;
    }

    const cardRotation = splayed
      ? (x + 50 - screenHalf) / (screenWidth / 50)
      : 0;

    if (card.id === null) {
      return <div style={{ position: "absolute", left: x, top: y }} />;
    }

    return (
      <div
        key={card.id}
        className="card-container"
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${cardRotation}deg)`,
          zIndex: isDragging ? 1000 : index,
          opacity:
            card.position === "discard" || card.position === "deck" ? 0 : 1,
        }}
        onMouseDown={(e) => handleMouseDown(card, e)}
        onMouseUp={() => {
          if (isDragging) {
            onClick?.(card);
          }
        }}
      >
        <Card selected={card.selected} card={card} />
      </div>
    );
  });
}

export default GameBoard;
