import { Card } from "../store/game/gameSlice";
import { HandType, ScoreCalculation, BonusResult } from "../types/scoreTypes";
import gameConfig from "../config/gameConfig.json";
import { HandLevelsState } from "../store/handLevels/handLevelsSlice";
import * as handLevelManager from './handLevelManager';

/**
 * Calculates the score for a given hand.
 * This is a pure function that takes the game state and returns a score calculation.
 *
 * @param handType The type of hand being played.
 * @param cards The cards in the hand.
 * @param handLevelsState The current state of hand levels.
 * @returns A detailed score calculation object.
 */
export function calculateScore(handType: HandType, cards: Card[], handLevelsState: HandLevelsState): ScoreCalculation {
  const handConfig = gameConfig.hands[handType];
  const baseChips = handConfig.baseChips || 0;
  const totalMultiplier = handLevelManager.getTotalMultiplier(handLevelsState, handType);

  // Start with base values
  let currentChips = baseChips;
  let currentMultiplier = totalMultiplier;
  const bonusDescriptions: string[] = [];

  // Step 1: Apply base hand score
  bonusDescriptions.push(`Base hand: ${handType} (${currentChips} chips)`);

  // Step 2: Calculate card value bonuses
  const cardBonuses = calculateCardValueBonuses(cards);
  if (cardBonuses.chipBonus) {
    currentChips += cardBonuses.chipBonus;
  }
  if (cardBonuses.description) {
    bonusDescriptions.push(cardBonuses.description);
  }

  // Step 3: Apply other bonuses
  const otherBonuses = calculateOtherBonuses(cards);
  if (otherBonuses.chipBonus) {
    currentChips += otherBonuses.chipBonus;
  }
  if (otherBonuses.multiplierBonus) {
    currentMultiplier *= otherBonuses.multiplierBonus;
  }
  if (otherBonuses.description) {
    bonusDescriptions.push(otherBonuses.description);
  }

  // Calculate final score
  const finalScore = Math.floor(currentChips * currentMultiplier);

  return {
    baseChips: baseChips,
    baseMultiplier: totalMultiplier,
    currentChips,
    currentMultiplier,
    handType: handType,
    finalScore,
    bonuses: bonusDescriptions.join(' • ')
  };
}

function calculateCardValueBonuses(cards: Card[]): BonusResult {
  let chipBonus = 0;
  const bonusDescriptions: string[] = [];

  cards.forEach((card) => {
    let cardBonus = 0;
    if (card.value === 14) {  // Ace
      cardBonus = 11;
    } else if (card.value >= 11) {  // Face cards
      cardBonus = 10;
    } else {  // Number cards
      cardBonus = card.value;
    }
    chipBonus += cardBonus;
    bonusDescriptions.push(`${card.label}: +${cardBonus}`);
  });

  return {
    chipBonus,
    description: bonusDescriptions.length > 0
      ? `Card bonuses: ${bonusDescriptions.join(', ')}`
      : ''
  };
}

function calculateOtherBonuses(cards: Card[]): BonusResult {
  const result: BonusResult = {
    description: ""
  };

  const hasAce = cards.some(card => card.value === 14);
  const hasFaceCard = cards.some(card => card.value >= 11 && card.value <= 13);

  if (hasAce) {
    result.multiplierBonus = gameConfig.bonuses.highCardBonus.ace;
    result.description += "Ace bonus! ";
  } else if (hasFaceCard) {
    result.multiplierBonus = gameConfig.bonuses.highCardBonus.faceCard;
    result.description += "Face card bonus! ";
  }

  const allSameSuit = cards.every(card => card.suit === cards[0].suit);
  if (allSameSuit) {
    // This part of the logic seems to have a bug in the original code.
    // I'm keeping it as is, but it might need review.
    // The suit bonus is being multiplied, but it is defined as a number in the config.
    const suit = cards[0].suit as keyof typeof gameConfig.bonuses.suitBonus;
    if (gameConfig.bonuses.suitBonus[suit]) {
      result.chipBonus = (result.chipBonus || 0) + gameConfig.bonuses.suitBonus[suit];
      result.description += `${suit} suit bonus! `;
    }
  }

  return result;
}
