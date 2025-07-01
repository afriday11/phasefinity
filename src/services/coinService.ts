/**
 * Coin Service
 * 
 * This service provides centralized functions for granting coins to players,
 * calculating coin rewards, and managing coin-related transactions.
 * It integrates with the economy slice to update player coin balance.
 */

import { COIN_REWARDS } from '../types/economyTypes';
import { Dispatch } from 'react';
import { EconomyAction } from '../types/actions';

/**
 * Grant coins to the player with a specific reason.
 * This is the centralized function for all coin rewards.
 * 
 * @param dispatch - The dispatch function from the app context
 * @param amount - Number of coins to grant (must be positive)
 * @param reason - Description of why coins are being granted
 */
export function grantCoins(
  dispatch: Dispatch<EconomyAction>, 
  amount: number, 
  reason: string
): void {
  if (amount <= 0) {
    console.warn(`⚠️ Attempted to grant invalid coin amount: ${amount}`);
    return;
  }

  // Dispatch the coin granting action
  dispatch({
    type: 'GRANT_COINS',
    payload: {
      amount,
      reason
    }
  });

  // TODO: Future enhancements could include:
  // - UI toast notifications
  // - Sound effects 
  // - Coin animation effects
  console.log(`💰 Granted ${amount} coins: ${reason}`);
}

/**
 * Calculate coins earned from completing a level.
 * Includes base completion reward plus bonus for unused hands.
 * 
 * @param handsRemaining - Number of hands/turns the player didn't use
 * @returns Total coins earned from level completion
 */
export function calculateLevelCompletionCoins(handsRemaining: number): number {
  const baseReward = COIN_REWARDS.levelCompletion;
  const unusedHandsBonus = handsRemaining * COIN_REWARDS.unusedHandBonus;
  
  return baseReward + unusedHandsBonus;
}

/**
 * Grant coins for completing a level.
 * This function should be called when a player successfully completes a level.
 * 
 * @param dispatch - The dispatch function from the app context
 * @param handsRemaining - Number of hands/turns the player didn't use
 */
export function grantLevelCompletionCoins(
  dispatch: Dispatch<EconomyAction>, 
  handsRemaining: number
): void {
  const totalCoins = calculateLevelCompletionCoins(handsRemaining);
  const baseReward = COIN_REWARDS.levelCompletion;
  const bonus = handsRemaining * COIN_REWARDS.unusedHandBonus;
  
  let reason = `Level completed (+${baseReward})`;
  if (bonus > 0) {
    reason += ` + Efficiency bonus (+${bonus} for ${handsRemaining} unused hands)`;
  }
  
  grantCoins(dispatch, totalCoins, reason);
}

/**
 * Spend coins for a purchase.
 * This function validates the player has enough coins before spending.
 * 
 * @param dispatch - The dispatch function from the app context  
 * @param currentCoins - Player's current coin balance
 * @param amount - Number of coins to spend
 * @param reason - Description of what is being purchased
 * @returns true if the purchase was successful, false if insufficient coins
 */
export function spendCoins(
  dispatch: Dispatch<EconomyAction>,
  currentCoins: number,
  amount: number,
  reason: string
): boolean {
  if (amount <= 0) {
    console.warn(`⚠️ Attempted to spend invalid coin amount: ${amount}`);
    return false;
  }

  if (currentCoins < amount) {
    console.warn(`❌ Insufficient coins for purchase: need ${amount}, have ${currentCoins}`);
    return false;
  }

  dispatch({
    type: 'SPEND_COINS',
    payload: {
      amount,
      reason
    }
  });

  console.log(`💸 Spent ${amount} coins: ${reason}`);
  return true;
} 