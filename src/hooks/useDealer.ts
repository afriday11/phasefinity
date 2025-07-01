import { useEffect, useState } from "react";
import { Card } from "../store/game/gameSlice";
import playSound from "../utils/playDealSound";

// this hook is used to animate the cards when they are moved from one position to another.
// it compares the incoming cards to the local state and only moves the first card that is different.
// A delay is set between each card, and we report back the current state of the cards and the animation state.
function useDealer(cardState: Card[]) {
  const [cards, setCards] = useState<Card[]>(cardState);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;

    // Check if any cards have changed position/state
    for (let i = 0; i < cardState.length; i++) {
      const currentCard = cardState[i];
      const localCard = cards.find((card) => card.id === currentCard.id);
      
      if (localCard) {
        // if this card is identical as the one in the local state, skip it
        if (compareCars(localCard, currentCard)) continue;

        // Update the local state with the new card position (by ID, not index)
        playSound();
        setCards(
          cards.map((card) => {
            if (card.id === currentCard.id) return currentCard;
            return card;
          })
        );

        // Set a delay to allow the animation to complete
        setWaiting(true);
        setTimeout(() => {
          setWaiting(false);
        }, 100);

        // stop processing further cards until the animation is complete
        // and let the next useEffect call pick up where we left off
        return;
      }
    }
    
    // If we get here, all cards match or we need to initialize with the new state
    if (cards.length !== cardState.length) {
      console.log("🔄 Initializing dealer with new card state");
      setCards([...cardState]);
    }
  }, [cardState, cards, waiting]);

  return { cards, isDealing: waiting };
}

// object compare properties
function compareCars(obj1: Card, obj2: Card): boolean {
  return Object.keys(obj1).every(
    (key) => obj1[key as keyof Card] === obj2[key as keyof Card]
  );
}

export default useDealer;
