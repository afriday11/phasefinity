import { Card } from "../store/game/gameSlice";
import { HandType } from "../types/scoreTypes";

/**
 * This module provides pure functions for evaluating poker hands.
 * Updated to return contributing cards - only cards that actually form the poker hand.
 */

interface HandEvaluationResult {
  handType: HandType;
  highCard?: number;
  contributingCards: Card[]; // Cards that actually contribute to the hand type
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
 * Gets the contributing cards for a straight hand.
 * Returns the 5 cards that form the straight (highest possible).
 */
function getStraightContributingCards(cards: Card[]): Card[] {
  const sorted = [...cards].sort((a, b) => b.value - a.value);
  const uniqueValues = [...new Set(sorted.map(c => c.value))].sort((a, b) => b - a);

  // Check for regular straights (highest first)
  for (let i = 0; i <= uniqueValues.length - 5; i++) {
    if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
      const straightValues = uniqueValues.slice(i, i + 5);
      return straightValues.map(value => 
        sorted.find(card => card.value === value)!
      );
    }
  }

  // Check for ace-low straight (A, 2, 3, 4, 5)
  if (uniqueValues.includes(14) && uniqueValues.includes(5) && 
      uniqueValues.includes(4) && uniqueValues.includes(3) && uniqueValues.includes(2)) {
    const aceLowValues = [5, 4, 3, 2, 14]; // Ace is low in this straight
    return aceLowValues.map(value => 
      sorted.find(card => card.value === value)!
    );
  }

  return [];
}

/**
 * Gets the contributing cards for a flush hand.
 * Returns the 5 highest cards of the flush suit.
 */
function getFlushContributingCards(cards: Card[]): Card[] {
  const suitGroups = cards.reduce((acc, card) => {
    acc[card.suit] = acc[card.suit] || [];
    acc[card.suit].push(card);
    return acc;
  }, {} as Record<string, Card[]>);

  // Find the suit with 5+ cards
  for (const suit in suitGroups) {
    if (suitGroups[suit].length >= 5) {
      return suitGroups[suit]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    }
  }
  return [];
}

/**
 * Evaluates a hand of cards to determine its poker rank and contributing cards.
 * @param cards The cards to evaluate.
 * @returns An object containing the hand type, high card, and cards that contribute to the hand.
 */
export function evaluateHand(cards: Card[]): HandEvaluationResult {
  if (cards.length === 0) {
    return { handType: "highCard", contributingCards: [] };
  }

  const highestCard = Math.max(...cards.map((card) => card.value));
  const sortedCards = [...cards].sort((a, b) => b.value - a.value);

  const valueCounts = cards.reduce((acc, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const values = Object.values(valueCounts);
  const uniqueValues = Object.keys(valueCounts).map(Number);

  const isStraight = hasStraight(uniqueValues);
  const isFlush = hasFlush(cards);

  let handType: HandType;
  let contributingCards: Card[] = [];

  if (isStraight && isFlush) {
    handType = "straightFlush";
    contributingCards = getStraightContributingCards(cards);
  } else if (values.includes(4)) {
    handType = "fourOfAKind";
    // Find the value that appears 4 times
    const fourOfAKindValue = Number(Object.keys(valueCounts).find(val => valueCounts[Number(val)] === 4));
    contributingCards = cards.filter(card => card.value === fourOfAKindValue);
  } else if (values.includes(3) && values.includes(2)) {
    handType = "fullHouse";
    // Find the values for three of a kind and pair
    const threeOfAKindValue = Number(Object.keys(valueCounts).find(val => valueCounts[Number(val)] === 3));
    const pairValue = Number(Object.keys(valueCounts).find(val => valueCounts[Number(val)] === 2));
    contributingCards = cards.filter(card => 
      card.value === threeOfAKindValue || card.value === pairValue
    );
  } else if (isFlush) {
    handType = "flush";
    contributingCards = getFlushContributingCards(cards);
  } else if (isStraight) {
    handType = "straight";
    contributingCards = getStraightContributingCards(cards);
  } else if (values.includes(3)) {
    handType = "threeOfAKind";
    // Find the value that appears 3 times
    const threeOfAKindValue = Number(Object.keys(valueCounts).find(val => valueCounts[Number(val)] === 3));
    contributingCards = cards.filter(card => card.value === threeOfAKindValue);
  } else if (values.filter((count) => count === 2).length === 2) {
    handType = "twoPair";
    // Find the two values that appear twice
    const pairValues = Object.keys(valueCounts)
      .filter(val => valueCounts[Number(val)] === 2)
      .map(Number);
    contributingCards = cards.filter(card => pairValues.includes(card.value));
  } else if (values.includes(2)) {
    handType = "pair";
    // Find the value that appears twice
    const pairValue = Number(Object.keys(valueCounts).find(val => valueCounts[Number(val)] === 2));
    contributingCards = cards.filter(card => card.value === pairValue);
  } else {
    handType = "highCard";
    // For high card, only the highest card contributes
    contributingCards = [sortedCards[0]];
  }

  return {
    handType: handType,
    highCard: handType === "highCard" ? highestCard : undefined,
    contributingCards: contributingCards
  };
}
