/**
 * This module provides pure functions for querying hand level data.
 * The state for hand levels is managed by the handLevelsReducer and this manager
 * provides a way to compute derived values from that state.
 */
import { HandLevel, HandType } from '../types/scoreTypes';
import { HandLevelsState } from '../store/handLevels/handLevelsSlice';

/**
 * Retrieves the level information for a specific hand type from the state.
 * @param state - The current state of all hand levels.
 * @param handType - The type of hand to look up.
 * @returns The level information for the specified hand.
 */
export function getHandLevel(state: HandLevelsState, handType: HandType): HandLevel {
  return state[handType];
}

/**
 * Calculates the total multiplier for a given hand type.
 * This is a combination of the hand's base multiplier and its current run multiplier.
 * @param state - The current state of all hand levels.
 * @param handType - The type of hand to calculate the multiplier for.
 * @returns The total multiplier for the hand.
 */
export function getTotalMultiplier(state: HandLevelsState, handType: HandType): number {
  const handLevel = getHandLevel(state, handType);
  return handLevel.baseMultiplier * handLevel.runMultiplier;
}