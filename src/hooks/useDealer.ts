import { useEffect, useState } from "react";
import { Card } from "../reducers/gameReducer";
import playSound from "../utils/playDealSound";

// this hook is used to animate the cards when they are moved from one position to another.
// it compares the incoming cards to the local state and only moves the first card that is different.
// A delay is set between each card, and we report back the current state of the cards and the animation state.
function useDealer(cardState: Card[]) {
  const [cards, setCards] = useState<Card[]>(cardState);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (waiting) return;

    for (let i = 0; i < cardState.length; i++) {
      const match = cards.find((card) => card.id === cardState[i].id);
      if (match) {
        // if this card is identical as the one in the local state, skip it
        if (compareCars(match, cardState[i])) continue;

        // Update the local state with the new card position
        playSound();
        setCards(
          cards.map((card, index) => {
            if (index === i) return cardState[i];
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
      // start the card in the deck if we've never seen it before
      return setCards(cardState.map((card) => ({ ...card, position: "deck" })));
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
