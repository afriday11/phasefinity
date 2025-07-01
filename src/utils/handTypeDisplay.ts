/**
 * Game Mode Display Utility
 * 
 * This utility manages the game mode (Phase 10 vs Poker) and provides
 * mode-appropriate display names for hand types and suits. It serves as
 * the central controller for game mode behavior.
 */

import { HandType } from '../types/scoreTypes';
import { Suit } from '../types/jokerTypes';

/** Supported game modes */
export type GameMode = 'phase10' | 'poker';

/** 
 * Feature flag to control game mode
 * TODO: This could be moved to environment variables or user settings in the future
 */
const CURRENT_GAME_MODE: GameMode = 'phase10';

/**
 * Get the current game mode
 * @returns The active game mode
 */
export function getCurrentGameMode(): GameMode {
  return CURRENT_GAME_MODE;
}

/**
 * Check if we're currently in Phase 10 mode
 * @returns True if in Phase 10 mode, false if in Poker mode
 */
export function isPhase10Mode(): boolean {
  return CURRENT_GAME_MODE === 'phase10';
}

/**
 * Mode-aware hand type display name
 * @param handType The internal hand type identifier
 * @returns The appropriate display name based on current game mode
 */
export function getHandTypeName(handType: HandType): string {
  if (isPhase10Mode()) {
    return getPhase10HandTypeName(handType);
  } else {
    return getPokerHandTypeName(handType);
  }
}

/**
 * Mode-aware suit display name
 * @param suit The internal suit identifier
 * @returns The appropriate display name based on current game mode
 */
export function getSuitName(suit: Suit): string {
  if (isPhase10Mode()) {
    return getPhase10SuitName(suit);
  } else {
    return getPokerSuitName(suit);
  }
}

/**
 * Maps internal hand type names to Phase 10 display names
 * @param handType The internal hand type identifier
 * @returns The Phase 10 display name for the hand type
 */
export function getPhase10HandTypeName(handType: HandType): string {
  switch (handType) {
    case 'pair':
      return 'Set of 2';
    case 'twoPair':
      return 'Two Sets of 2';
    case 'threeOfAKind':
      return 'Set of 3';
    case 'fourOfAKind':
      return 'Set of 4';
    case 'straight':
      return 'Run of 5';
    case 'fullHouse':
      return 'A Set of 3 and a Set of 2';
    case 'flush':
      return 'Flush';
    case 'straightFlush':
      return 'Straight Flush';
    case 'highCard':
      return 'High Card';
    default:
      // Fallback to original name if unknown
      return handType;
  }
}

/**
 * Maps internal hand type names to traditional poker display names
 * @param handType The internal hand type identifier
 * @returns The poker display name for the hand type
 */
function getPokerHandTypeName(handType: HandType): string {
  switch (handType) {
    case 'pair':
      return 'Pair';
    case 'twoPair':
      return 'Two Pair';
    case 'threeOfAKind':
      return 'Three of a Kind';
    case 'fourOfAKind':
      return 'Four of a Kind';
    case 'straight':
      return 'Straight';
    case 'fullHouse':
      return 'Full House';
    case 'flush':
      return 'Flush';
    case 'straightFlush':
      return 'Straight Flush';
    case 'highCard':
      return 'High Card';
    default:
      return handType;
  }
}

/**
 * Maps internal suit names to Phase 10 color names
 * @param suit The internal suit identifier
 * @returns The Phase 10 color name for the suit
 */
export function getPhase10SuitName(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return 'red';
    case 'diamonds':
      return 'green';
    case 'spades':
      return 'blue';
    case 'clubs':
      return 'yellow';
    default:
      // Fallback to original name if unknown
      return suit;
  }
}

/**
 * Maps internal suit names to traditional poker suit names
 * @param suit The internal suit identifier  
 * @returns The poker display name for the suit
 */
function getPokerSuitName(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return 'hearts';
    case 'diamonds':
      return 'diamonds';
    case 'spades':
      return 'spades';
    case 'clubs':
      return 'clubs';
    default:
      return suit;
  }
}

 