import { Card } from "../store/game/gameSlice";
import { HandType } from "../types/scoreTypes";

/**
 * This module provides pure functions for evaluating poker hands.
 */

interface HandEvaluationResult {
  handType: HandType;
  highCard?: number;
}

function hasStraight(values: number[]): boolean {
  if (values.length < 5) return false;

  const sorted = [...new Set(values)].sort((a, b) => a - b);
  for (let i = 0; i <= sorted.length - 5; i++) {
    if (sorted[i + 4] - sorted[i] === 4) {
      return true;
    }
  }
  // Ace-low straight check
  if (
    sorted.includes(14) &&
    sorted.includes(2) &&
    sorted.includes(3) &&
    sorted.includes(4) &&
    sorted.includes(5)
  ) {
    return true;
  }
  return false;
}

function hasFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false;
  return cards.every((card) => card.suit === cards[0].suit);
}

/**
 * Evaluates a hand of cards to determine its poker rank.
 * @param cards The cards to evaluate.
 * @returns An object containing the hand type and high card value if applicable.
 */
export function evaluateHand(cards: Card[]): HandEvaluationResult {
  if (cards.length === 0) {
    return { handType: "highCard" };
  }

  const highestCard = Math.max(...cards.map((card) => card.value));

  const valueCounts = cards.reduce((acc, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const values = Object.values(valueCounts);
  const uniqueValues = Object.keys(valueCounts).map(Number);

  const isStraight = hasStraight(uniqueValues);
  const isFlush = hasFlush(cards);

  let handType: HandType;

  if (isStraight && isFlush) {
    handType = "straightFlush";
  } else if (values.includes(4)) {
    handType = "fourOfAKind";
  } else if (values.includes(3) && values.includes(2)) {
    handType = "fullHouse";
  } else if (isFlush) {
    handType = "flush";
  } else if (isStraight) {
    handType = "straight";
  } else if (values.includes(3)) {
    handType = "threeOfAKind";
  } else if (values.filter((count) => count === 2).length === 2) {
    handType = "twoPair";
  } else if (values.includes(2)) {
    handType = "pair";
  } else {
    handType = "highCard";
  }

  return {
    handType: handType,
    highCard: handType === "highCard" ? highestCard : undefined,
  };
}
