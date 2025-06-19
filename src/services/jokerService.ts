/**
 * Joker Service for PhaseInfinity
 * 
 * This service handles the evaluation and application of joker bonuses
 * to the scoring system. It processes equipped jokers left-to-right
 * and applies their bonuses based on trigger conditions.
 */

import { Joker, JokerResult } from '../types/jokerTypes';
import { Card } from '../store/game/gameSlice';

/**
 * Applies all equipped jokers to the base chips and multiplier
 * following the left-to-right execution order specified in the spec.
 * 
 * @param baseChips - Starting chip value before joker bonuses
 * @param baseMult - Starting multiplier before joker bonuses  
 * @param equippedJokers - Array of jokers currently equipped by player
 * @param playedCards - Cards in the current hand being evaluated
 * @param handType - The poker hand type (pair, flush, etc.)
 * @returns JokerResult with final chips, multiplier, and bonus descriptions
 */
export function applyJokers(
  baseChips: number,
  baseMult: number,
  equippedJokers: Joker[],
  playedCards: Card[],
  handType: string
): JokerResult {
  let chips = baseChips;
  let mult = baseMult;
  const bonusDescriptions: string[] = [];

  // Process jokers left-to-right as specified
  for (const joker of equippedJokers) {
    const bonus = evaluateJoker(joker, playedCards, handType);
    
    if (bonus.chipBonus > 0) {
      chips += bonus.chipBonus;
      bonusDescriptions.push(`${joker.name}: +${bonus.chipBonus} chips`);
    }
    
    if (bonus.multBonus > 0) {
      mult += bonus.multBonus;
      bonusDescriptions.push(`${joker.name}: +${bonus.multBonus} mult`);
    }
  }

  return {
    chips,
    mult,
    bonusDescriptions
  };
}

/**
 * Evaluates a single joker against the current hand context
 * to determine what bonuses it should provide.
 * 
 * @param joker - The joker to evaluate
 * @param playedCards - Cards in the current hand
 * @param handType - The poker hand type
 * @returns Object with chip and multiplier bonuses
 */
function evaluateJoker(
  joker: Joker, 
  playedCards: Card[], 
  handType: string
): { chipBonus: number; multBonus: number } {
  let chipBonus = 0;
  let multBonus = 0;

  switch (joker.trigger) {
    case 'always':
      // Always triggers once per hand
      if (joker.reward === 'mult') {
        multBonus = joker.value;
      } else {
        chipBonus = joker.value;
      }
      break;

    case 'onScoreSuit':
      // Triggers once per matching card in the hand
      if (joker.suit) {
        const matchingCards = playedCards.filter(card => card.suit === joker.suit);
        const matches = matchingCards.length;
        
        if (matches > 0) {
          if (joker.reward === 'mult') {
            multBonus = joker.value * matches;
          } else {
            chipBonus = joker.value * matches;
          }
        }
      }
      break;

    case 'onHandType':
      // Triggers once per hand if hand type matches
      if (joker.handType === handType) {
        if (joker.reward === 'mult') {
          multBonus = joker.value;
        } else {
          chipBonus = joker.value;
        }
      }
      break;

    default:
      console.warn(`Unknown joker trigger: ${joker.trigger}`);
  }

  return { chipBonus, multBonus };
}

/**
 * Loads joker data from the JSON configuration file.
 * This function can be used by shop systems or debug tools
 * to access all available jokers.
 * 
 * @returns Promise resolving to array of all joker configurations
 */
export async function loadJokerCatalog(): Promise<Joker[]> {
  try {
    const jokersModule = await import('../config/jokers.json');
    return jokersModule.default as Joker[];
  } catch (error) {
    console.error('Failed to load joker catalog:', error);
    return [];
  }
} 