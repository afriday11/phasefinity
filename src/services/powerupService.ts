/**
 * Powerup Service for PhaseInfinity
 * 
 * This service handles generating powerup options for the player
 * at the beginning of each level. It currently focuses on jokers
 * but is designed to be extensible for future powerup types.
 */

import { Joker } from '../types/jokerTypes';
import { Powerup, JokerPowerup } from '../types/powerupTypes';
import { getRandomJokers } from './jokerService';
import { GameAction } from '../types/actions';

/**
 * Converts a Joker to a JokerPowerup for the powerup system
 * @param joker The joker to convert
 * @returns JokerPowerup wrapper for the powerup system
 */
function jokerToPowerup(joker: Joker): JokerPowerup {
  return {
    id: `joker_${joker.id}`,
    type: 'joker',
    name: joker.name,
    description: getJokerDescription(joker),
    joker: joker,
  };
}

/**
 * Generates a human-readable description for a joker
 * @param joker The joker to describe
 * @returns Description string for the powerup screen
 */
function getJokerDescription(joker: Joker): string {
  const rewardText = joker.reward === 'mult' ? 'multiplier' : 'chips';
  
  switch (joker.trigger) {
    case 'always':
      return `Adds +${joker.value} ${rewardText} to every hand`;
    case 'onScoreSuit':
      return `Adds +${joker.value} ${rewardText} per ${joker.suit} card in hand`;
    case 'onHandType':
      return `Adds +${joker.value} ${rewardText} when playing a ${joker.handType}`;
    default:
      return `Adds +${joker.value} ${rewardText}`;
  }
}

/**
 * Generates an array of 3 random powerup options for the player
 * Currently only generates joker powerups, but extensible for future types
 * 
 * @param equippedJokers Currently equipped jokers to exclude
 * @param runNumber Current run number for unlock filtering
 * @returns Promise resolving to array of 3 powerup options
 */
export async function generatePowerupOptions(
  equippedJokers: Joker[] = [], 
  runNumber: number = 0
): Promise<Powerup[]> {
  try {
    // For now, only generate joker powerups
    const randomJokers = await getRandomJokers(3, equippedJokers, runNumber);
    const powerups = randomJokers.map(jokerToPowerup);
    
    console.log('🎁 Generated powerup options:', powerups.map(p => p.name));
    return powerups;
  } catch (error) {
    console.error('Failed to generate powerup options:', error);
    return [];
  }
}

/**
 * Applies a selected powerup to the game state
 * Dispatches the appropriate actions based on powerup type
 * 
 * @param powerup The powerup the player selected
 * @param dispatch Function to dispatch actions to the store
 */
export function applySelectedPowerup(powerup: Powerup, dispatch: (action: GameAction) => void): void {
  switch (powerup.type) {
    case 'joker':
      // Equip the joker
      dispatch({
        type: 'EQUIP_JOKER',
        payload: { joker: powerup.joker }
      });
      console.log('✨ Applied joker powerup:', powerup.name);
      break;
    
    default:
      console.warn(`Unknown powerup type: ${powerup.type}`);
  }
} 