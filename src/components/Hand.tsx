import { useEffect, useState } from "react";
import { Card as CardType } from "../reducers/gameReducer";
import Card from "./Card";

type HandProps = {
  cards: CardType[];
  yOffset: number;
  splayed?: boolean;
  anchor?: "top" | "bottom";
  onClick?: (card: CardType) => void;
};

function Hand({
  cards,
  yOffset,
  splayed = false,
  anchor = "top",
  onClick,
}: HandProps) {
  const cardWidth = 100;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenHalf = screenWidth / 2;
  const cardSpacing = Math.min((screenWidth * 0.666) / cards.length, 100);
  const xOffset = cardSpacing * (cards.length / 2);

  const mousePosition = useMousePosition();
  const mouseXcardIndex = Math.floor(mousePosition.x / cardSpacing);

  const anchoredYOffset = anchor === "top" ? yOffset : screenHeight - yOffset;

  // cards = cards.sort((a, b) => a.value - b.value);

  // create a new array and insert a blank card at the mouseXcardIndex
  const newCards = [...cards];
  newCards.splice(mouseXcardIndex, 0, { id: null, value: 0 });

  return newCards.map((card, index) => {
    const cardPosition = splayed
      ? index * cardSpacing + cardSpacing / 2 - xOffset
      : 0;

    const cardRotation = splayed ? cardPosition / (screenWidth / 50) : 0;
    const archOffset = cardPosition * (cardPosition / (screenWidth * 2));

    const x = cardPosition + screenHalf - cardWidth / 2;
    const y = anchoredYOffset - (card.selected ? 40 : 0) + archOffset;

    if (card.id === null) {
      return (
        <div key={9999999} style={{ position: "absolute", left: x, top: y }} />
      );
    }

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

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

export default Hand;
