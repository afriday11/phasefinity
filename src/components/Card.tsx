import { Card as CardType } from "../store/game/gameSlice";

// Card component renders individual playing cards with suit symbols and values.
// It handles visual feedback for selected state and provides smooth animations.
// The card shows suit symbols in corners and center, with proper color coding.

type cardProps = {
  card: CardType;
  selected: boolean;
};

function Card({ card, selected }: cardProps) {
  // Map card suits to their Unicode symbols
  const emoji = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[card.suit];

  // Define colors for red and black suits
  const color = {
    hearts: "rgb(184, 41, 60)",
    diamonds: "rgb(184, 41, 60)",
    clubs: "rgb(29, 39, 59)",
    spades: "rgb(29, 39, 59)",
  }[card.suit];

  return (
    <div className="card" style={{ color: color, top: selected ? -40 : 0 }}>
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
      
      {/* Bottom-right corner: rotated card value and suit */}
      <span
        className="card-value"
        style={{
          position: "absolute",
          bottom: 4,
          right: 4,
          transform: `rotate(180deg)`,
        }}
      >
        <span>{card.label}</span>
        <span className="noto-emoji-phasefinity">{emoji}</span>
      </span>
      
      {/* Center: large suit symbol */}
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
