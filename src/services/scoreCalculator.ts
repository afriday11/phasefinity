import { Card } from "../store/game/gameSlice";
import { ScoreCalculation, BonusResult } from "../types/scoreTypes";
import gameConfig from "../config/gameConfig.json";
import { HandLevelsState } from "../store/handLevels/handLevelsSlice";
import * as handLevelManager from './handLevelManager';
import { Joker, Suit } from "../types/jokerTypes";
import { applyJokers } from "./jokerService";
import { evaluateHand } from "./handEvaluator";
import { getHandTypeName, getSuitName } from "../utils/handTypeDisplay";

/**
 * Calculates the score for a given hand.
 * This is a pure function that takes the game state and returns a score calculation.
 * Updated to only apply bonuses to cards that actually contribute to the poker hand.
 *
 * @param playedCards All cards that were played by the player.
 * @param handLevelsState The current state of hand levels.
 * @param equippedJokers Array of jokers currently equipped by the player.
 * @returns A detailed score calculation object.
 */
export function calculateScore(
  playedCards: Card[], 
  handLevelsState: HandLevelsState,
  equippedJokers: Joker[] = []
): ScoreCalculation {
  // First, evaluate the hand to determine type and contributing cards
  const handEvaluation = evaluateHand(playedCards);
  const { handType, contributingCards } = handEvaluation;

  const handConfig = gameConfig.hands[handType];
  const baseChips = handConfig.baseChips || 0;
  const totalMultiplier = handLevelManager.getTotalMultiplier(handLevelsState, handType);

  // Start with base values
  let currentChips = baseChips;
  let currentMultiplier = totalMultiplier;
  const bonusDescriptions: string[] = [];

  // Step 1: Apply base hand score
  bonusDescriptions.push(`Base hand: ${getHandTypeName(handType)} (${currentChips} chips)`);

  // Step 2: Calculate card value bonuses - ONLY for contributing cards
  const cardBonuses = calculateCardValueBonuses(contributingCards);
  if (cardBonuses.chipBonus) {
    currentChips += cardBonuses.chipBonus;
  }
  if (cardBonuses.description) {
    bonusDescriptions.push(cardBonuses.description);
  }

  // Step 3: Apply other bonuses - ONLY for contributing cards
  const otherBonuses = calculateOtherBonuses(contributingCards);
  if (otherBonuses.chipBonus) {
    currentChips += otherBonuses.chipBonus;
  }
  if (otherBonuses.multiplierBonus) {
    currentMultiplier *= otherBonuses.multiplierBonus;
  }
  if (otherBonuses.description) {
    bonusDescriptions.push(otherBonuses.description);
  }

  // Step 4: Apply joker bonuses - pass contributing cards to jokers
  if (equippedJokers.length > 0) {
    const jokerResult = applyJokers(currentChips, currentMultiplier, equippedJokers, contributingCards, handType);
    currentChips = jokerResult.chips;
    currentMultiplier = jokerResult.mult;
    
    // Add joker bonus descriptions
    jokerResult.bonusDescriptions.forEach(desc => {
      bonusDescriptions.push(desc);
    });
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
      result.description += `${getSuitName(cards[0].suit as Suit)} suit bonus! `;
    }
  }

  return result;
}
