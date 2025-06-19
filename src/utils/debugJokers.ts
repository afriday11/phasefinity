/**
 * Debug utility for testing the joker system
 * This allows us to add test jokers to the game state during development
 */

import { Joker } from '../types/jokerTypes';
import { GameAction } from '../types/actions';

// Sample jokers for testing - using data from jokers.json
export const testJokers: Joker[] = [
  {
    id: 1,
    key: "joker",
    name: "Joker",
    cost: 2,
    rarity: "common",
    unlockAtRun: 0,
    reward: "mult",
    value: 4,
    trigger: "always"
  },
  {
    id: 2,
    key: "greedy_joker",
    name: "Greedy Joker",
    cost: 5,
    rarity: "common",
    unlockAtRun: 0,
    reward: "mult",
    value: 3,
    trigger: "onScoreSuit",
    suit: "diamonds"
  },
  {
    id: 6,
    key: "jolly_joker",
    name: "Jolly Joker",
    cost: 3,
    rarity: "common",
    unlockAtRun: 0,
    reward: "mult",
    value: 8,
    trigger: "onHandType",
    handType: "pair"
  }
];

/**
 * Dispatches actions to add test jokers to the game state
 * Call this from the browser console during development
 */
export function addTestJokers(dispatch: (action: GameAction) => void) {
  // Add the first few test jokers
  testJokers.slice(0, 3).forEach(joker => {
    dispatch({
      type: 'EQUIP_JOKER',
      payload: { joker }
    });
  });
  
  console.log('🃏 Added test jokers:', testJokers.slice(0, 3).map(j => j.name));
}

// Note: This function is made available globally through App.tsx
// Use window.debugGame.addTestJokers() in the browser console 