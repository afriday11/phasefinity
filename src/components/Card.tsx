import { Card as CardType } from "../reducers/gameReducer";

type cardProps = {
  card: CardType;
  selected: boolean;
};

function Card({ card, selected }: cardProps) {
  const emoji = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[card.suit];

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
