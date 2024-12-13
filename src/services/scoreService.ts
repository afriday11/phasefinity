import { Card } from '../reducers/gameReducer';
import { HandType } from '../types/scoreTypes';

interface HandEvaluation {
  handType: HandType;
  score: number;
  highCard?: number;
}

function hasStraight(values: number[]): boolean {
  if (values.length < 5) return false; // A straight requires at least 5 cards

  const sorted = [...new Set(values)].sort((a, b) => a - b); // Remove duplicates and sort
  for (let i = 0; i <= sorted.length - 5; i++) {
    if (sorted[i + 4] - sorted[i] === 4) {
      return true;
    }
  }
  return false;
}

function hasFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false; // A flush requires at least 5 cards
  return cards.every(card => card.suit === cards[0].suit);
}

export function isValidHandSize(cards: Card[]): boolean {
  const validHandSizes = [2, 3, 4, 5]; // Pairs need 2, three of a kind needs 3, etc.
  return validHandSizes.includes(cards.length);
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length === 0) {
    return { handType: 'highCard', score: 0 };
  }

  // Get the highest card value for scoring
  const highestCard = Math.max(...cards.map(card => card.value));

  // Count occurrences of each value
  const valueCounts = cards.reduce((acc, card) => {
    acc[card.value] = (acc[card.value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const values = Object.values(valueCounts);
  const uniqueValues = Object.keys(valueCounts).map(Number);
  
  // Check for different hand types
  const isStraight = hasStraight(uniqueValues);
  const isFlush = hasFlush(cards);

  // Evaluate hand type from best to worst
  if (isStraight && isFlush) {
    return { handType: 'straightFlush', score: calculateScore('straightFlush', highestCard) };
  }

  if (values.includes(4)) {
    return { handType: 'fourOfAKind', score: calculateScore('fourOfAKind', highestCard) };
  }

  if (values.includes(3) && values.includes(2)) {
    return { handType: 'fullHouse', score: calculateScore('fullHouse', highestCard) };
  }

  if (isFlush) {
    return { handType: 'flush', score: calculateScore('flush', highestCard) };
  }

  if (isStraight) {
    return { handType: 'straight', score: calculateScore('straight', highestCard) };
  }

  if (values.includes(3)) {
    return { handType: 'threeOfAKind', score: calculateScore('threeOfAKind', highestCard) };
  }

  if (values.filter(count => count === 2).length === 2) {
    return { handType: 'twoPair', score: calculateScore('twoPair', highestCard) };
  }

  if (values.includes(2)) {
    return { handType: 'pair', score: calculateScore('pair', highestCard) };
  }

  // Fallback to high card if no other hand type matches
  return { 
    handType: 'highCard', 
    score: calculateScore('highCard', highestCard),
    highCard: highestCard 
  };
}

export function calculateScore(handType: HandType, highestCard?: number): number {
  const scoreValues = {
    highCard: 1, // Add a base score for highCard if needed
    pair: 10,
    twoPair: 20,
    threeOfAKind: 30,
    straight: 40,
    flush: 50,
    fullHouse: 60,
    fourOfAKind: 70,
    straightFlush: 100
  };

  // Optionally use highestCard for additional scoring logic
  return scoreValues[handType] || 0;
}
