import { Card as CardType } from "../store/game/gameSlice";

// Card component renders individual playing cards with suit symbols and values.
// It handles visual feedback for selected state and provides smooth animations.
// The card shows suit symbols in corners and center, with proper color coding.

type cardProps = {
  card: CardType;
  selected: boolean;
};

function Card({ card, selected }: cardProps) {
  card = cardRemap(card);

  // Map card suits to their Unicode symbols
  const emoji = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }[card.suit];

  // Define colors for red and black suits
  let color = {
    hearts: "rgb(184, 41, 60)",
    diamonds: "rgb(29, 69, 179)",
    clubs: "rgb(238, 204, 12)",
    spades: "rgb(35, 155, 75)",
  }[card.suit];

  if (card.label === "WILD") {
    color = "rgb(0, 0, 0)";
  }

  return (
    <div
      className="card"
      style={{
        top: selected ? -40 : 0,
      }}
    >
      <div
        className="card-color"
        style={{
          backgroundColor: color,
          top: -10,
        }}
      />
      <div
        className="card-color"
        style={{
          backgroundColor: color,
          bottom: -10,
        }}
      />
      <span
        className="card-value"
        style={{
          position: "absolute",
          top: 2,
          left: 6,
        }}
      >
        <span>{card.label === "WILD" ? "W" : card.label}</span>
        {/* <span className="noto-emoji-phasefinity">{emoji}</span> */}
      </span>

      {/* Bottom-right corner: rotated card value and suit */}
      <span
        className="card-value"
        style={{
          position: "absolute",
          bottom: 2,
          right: 6,
          transform: `rotate(170deg)`,
        }}
      >
        <span>{card.label === "WILD" ? "W" : card.label}</span>
        {/* <span className="noto-emoji-phasefinity">{emoji}</span> */}
      </span>

      {/* Center: large suit symbol */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          fontSize: card.label === "WILD" ? "32px" : "42px",
          transform: `translate(-50%, -50%) rotate(-10deg)`,
          color: color,
        }}
      >
        {card.label}
        {/* <span className="noto-emoji-phasefinity">{emoji}</span> */}
      </div>
    </div>
  );
}

function cardRemap(card: CardType) {
  const remappedCard = { ...card };
  if (card.label === "A") {
    remappedCard.label = "1";
  }
  if (card.label === "J") {
    remappedCard.label = "11";
  }
  if (card.label === "Q") {
    remappedCard.label = "12";
  }
  // Note: Kings (K) are not included in Phase 10 mode deck
  // so they no longer need to be converted to WILD cards
  return remappedCard;
}

export default Card;
