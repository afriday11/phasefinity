import { Card } from "../reducers/gameReducer";
import { HandType, ScoreCalculation } from "../types/scoreTypes";
import { ScoreCalculator } from './scoreCalculator';
import { HandLevelService } from './handLevelService';

interface HandEvaluation {
  handType: HandType;
  score: number;
  highCard?: number;
  calculation?: ScoreCalculation; // ScoreCalculation is a type from scoreCalculator.ts
  level: number;
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
  return cards.every((card) => card.suit === cards[0].suit);
}

export function isValidHandSize(cards: Card[]): boolean {
  const validHandSizes = [2, 3, 4, 5]; // Pairs need 2, three of a kind needs 3, etc.
  return validHandSizes.includes(cards.length);
}

export class ScoreService {
  private handLevelService: HandLevelService;

  constructor() {
    this.handLevelService = new HandLevelService();
  }

  public evaluateHand(cards: Card[]): HandEvaluation {
    if (cards.length === 0) {
      return { handType: "highCard", score: 0, level: 1 };
    }

  // Get the highest card value for scoring
  const highestCard = Math.max(...cards.map((card) => card.value));

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

  let handType: HandType;

  // Evaluate hand type from best to worst
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

    // After determining hand type, calculate score with bonuses
    const calculator = new ScoreCalculator(handType, cards, this.handLevelService);
    const scoreCalculation = calculator.calculateScore();

    return {
      handType: handType,
      score: scoreCalculation.finalScore,
      calculation: scoreCalculation,
      highCard: handType === "highCard" ? highestCard : undefined,
      level: this.handLevelService.getHandLevel(handType).level
    };
  }

  public upgradeHandBaseLevel(handType: HandType): void {
    this.handLevelService.upgradeHandBaseLevel(handType);
  }

  public upgradeHandRunMultiplier(handType: HandType): void {
    this.handLevelService.upgradeHandRunMultiplier(handType);
  }
}

export function calculateScore(handType: HandType): number {
  const scoreValues = {
    highCard: 1, // Add a base score for highCard if needed
    pair: 10,
    twoPair: 20,
    threeOfAKind: 30,
    straight: 40,
    flush: 50,
    fullHouse: 60,
    fourOfAKind: 70,
    straightFlush: 100,
  };

  // Optionally use highestCard for additional scoring logic
  return scoreValues[handType] || 0;
}
