/**
 * Economy Types for PhaseInfinity Upgrade System
 * 
 * This file defines the core data structures for the upgrade economy,
 * including jokers, hand upgrades, shop items, and player economic state.
 * These types support the progression system where players earn coins
 * and can purchase upgrades to improve their scoring potential.
 */

import { HandType } from './scoreTypes';

/** Point-in-time score data for different hand types */
export interface HandScoreConfig {
  name: string;          // "Pair", "Straight", etc.
  baseChips: number;     // chips awarded before bonuses
  multiplier: number;    // base multiplier
}

/** Configuration for purchasable joker cards */
export interface JokerConfig {
  id: string;            // "mult_+1", "chips_+10", etc.
  label: string;         // UI display name
  description: string;   // tooltip/description text
  chipBonus: number;     // additive chip bonus
  multiplierBonus: number; // additive multiplier bonus
  price: number;         // cost in coins
  rarity: 'common' | 'rare' | 'legendary';
}

/** Configuration for hand-specific upgrades */
export interface HandUpgradeConfig {
  handType: HandType;    // Which hand type this upgrade applies to
  chipDelta: number;     // +N chips per upgrade tier
  multDelta: number;     // +N multiplier per upgrade tier
  levelCap: number;      // maximum upgrade tiers allowed
  basePrice: number;     // price for tier 1 upgrade
}

/** Items available for purchase in the shop */
export interface ShopItem {
  type: 'joker' | 'handUpgrade';
  data: JokerConfig | { upgrade: HandUpgradeConfig; tier: number };
  price: number;  // cached price for stability even if config changes
}

/** Player's economic state and inventory */
export interface PlayerEconomyState {
  coins: number;
  ownedJokers: JokerConfig[];
  handUpgrades: Record<string /*handType*/, number /*current tier*/>;
}

/** Rarity multipliers for joker pricing calculations */
export const RARITY_MULTIPLIERS = {
  common: 1.0,
  rare: 1.5,
  legendary: 2.5
} as const;

/** Shop configuration constants */
export const SHOP_CONFIG = {
  itemCount: { min: 3, max: 5 },
  jokerChance: 0.7,       // 70% chance for jokers
  handUpgradeChance: 0.3  // 30% chance for hand upgrades
} as const;

/** Coin reward constants */
export const COIN_REWARDS = {
  levelCompletion: 5,     // flat reward for completing a level
  unusedHandBonus: 1      // coins per unused hand remaining
} as const; 