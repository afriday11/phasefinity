import { Card as CardType } from "../App";

type cardProps = {
  card: CardType;
  zIndex: number;
  position: { x: number; y: number };
  rotation: number;
  onClick: () => void;
};

function Card({ card, zIndex, position, rotation, ...props }: cardProps) {
  return (
    <div
      key={card.id}
      className="card"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        zIndex: zIndex,
      }}
      {...props}
    >
      <span className="card-value">
        <span>{card.value}</span>
        <span>
          {
            {
              hearts: "♥️",
              diamonds: "♦️",
              clubs: "♣️",
              spades: "♠️",
            }[card.suit]
          }
        </span>
      </span>
    </div>
  );
}

export default Card;
