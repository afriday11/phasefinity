import { Card as CardType } from "../reducers/gameReducer";
import { useEffect, useState } from "react";

type cardProps = {
  card: CardType;
  zIndex: number;
  position: { x: number; y: number };
  rotation: number;
  onClick: () => void;
};

function Card({ card, zIndex, position, rotation, ...props }: cardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 30);
    return () => clearTimeout(timer);
  }, [card.position]);

  const emoji = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[card.suit];

  return (
    <div
      key={card.id}
      className="card"
      style={{
        transform: `translate(${position.x}px, ${
          position.y
        }px) rotate(${rotation}deg) ${
          isAnimating ? "scaleY(2.5) scaleX(0.5)" : "scaleY(1) scaleX(1)"
        }`,
        zIndex: zIndex,
        opacity:
          card.position === "discard" || card.position === "deck" ? 0 : 1,
      }}
      {...props}
    >
      <span
        className="card-value"
        style={{
          position: "absolute",
          top: 4,
          left: 4,
        }}
      >
        <span>{card.label}</span>
        <span className="noto-emoji-phasefinity">{emoji}</span>
      </span>
      <span
        className="card-value"
        style={{
          position: "absolute",
          bottom: 4,
          right: 4,
          transform: `rotate(180deg)`,
        }}
      >
        <span>{card.value}</span>
        <span className="noto-emoji-phasefinity">{emoji}</span>
      </span>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          fontSize: "42px",
          transform: `translate(-50%, -50%)`,
        }}
      >
        <span className="noto-emoji-phasefinity">{emoji}</span>
      </div>
    </div>
  );
}

export default Card;
