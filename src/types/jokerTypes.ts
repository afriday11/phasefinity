/**
 * Joker System Types for PhaseInfinity
 * 
 * This file defines the core data structures for the joker system,
 * including joker cards, triggers, and evaluation context.
 * Jokers are passive power-ups that modify chips or multipliers
 * based on hand types or card suits.
 */

import { HandType } from './scoreTypes';

/** Card suits that jokers can trigger on */
export type Suit = 'hearts' | 'diamonds' | 'spades' | 'clubs';

/** When a joker activates during scoring */
export type Trigger = 'always' | 'onScoreSuit' | 'onHandType';

/** What kind of bonus a joker provides */
export type Reward = 'mult' | 'chips';

/** Core joker interface matching the JSON structure */
export interface Joker {
  id: number;            // 1-based ID for the joker
  key: string;           // snake_case identifier for saves/lookups
  name: string;          // Display name like "Greedy Joker"
  cost: number;          // Shop price in coins
  rarity: 'common';      // Only commons for Phase 1
  unlockAtRun: number;   // 0 = available from start
  reward: Reward;        // Whether it adds 'mult' or 'chips'
  value: number;         // +m or +c amount to add
  trigger: Trigger;      // When this joker activates
  suit?: Suit;           // Required if trigger === 'onScoreSuit'
  handType?: HandType;   // Required if trigger === 'onHandType'
}

/** Context passed to joker evaluation function */
export interface HandContext {
  playedCards: Array<{
    suit: string;
    value: number;
    label: string;
  }>;
  handType: HandType;
  baseChips: number;
  baseMultiplier: number;
}

/** Result of applying all jokers to a hand */
export interface JokerResult {
  chips: number;         // Final chips after joker bonuses
  mult: number;          // Final multiplier after joker bonuses
  bonusDescriptions: string[];  // Array of bonus descriptions for UI
}

/** Action types for joker state management */
export interface JokerAction {
  type: 'ADD_JOKER' | 'REMOVE_JOKER' | 'CLEAR_JOKERS';
  payload?: {
    joker?: Joker;
    jokerId?: number;
  };
} 