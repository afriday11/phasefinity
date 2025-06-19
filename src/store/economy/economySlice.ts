/**
 * Economy State Slice
 * 
 * This file manages the player's economic state including coins, owned jokers,
 * and hand upgrade levels. It provides reducers for coin transactions and
 * inventory management that support the upgrade economy system.
 */

import createReducer from "../../utils/createReducer";
import { PlayerEconomyState, JokerConfig } from "../../types/economyTypes";
import { EconomyAction } from "../../types/actions";

// Initial state for the economy - player starts with some coins but no upgrades
export const initialEconomyState: PlayerEconomyState = {
  coins: 5,              // Starting coins to allow early purchases
  ownedJokers: [],        // No jokers at start
  handUpgrades: {},       // No hand upgrades at start
};

/**
 * Economy reducer handles all coin transactions and inventory changes.
 * Ensures coins never go negative and validates all transactions.
 */
const economyReducer = createReducer<PlayerEconomyState, EconomyAction>({
  
  // Grant coins to the player (level completion, bonuses, etc.)
  GRANT_COINS: (state: PlayerEconomyState, action): PlayerEconomyState => {
    const amount = action.payload.amount;
    const reason = action.payload.reason || 'Unknown';
    
    console.log(`💰 Granting ${amount} coins: ${reason}`);
    
    return {
      ...state,
      coins: Math.max(0, state.coins + amount) // Ensure coins never go negative
    };
  },

  // Spend coins (shop purchases, etc.)
  SPEND_COINS: (state: PlayerEconomyState, action): PlayerEconomyState => {
    const amount = action.payload.amount;
    const reason = action.payload.reason || 'Purchase';
    
    // Validate the player has enough coins
    if (state.coins < amount) {
      console.warn(`❌ Insufficient coins: need ${amount}, have ${state.coins}`);
      return state; // Return unchanged state if can't afford
    }
    
    console.log(`💸 Spending ${amount} coins: ${reason}`);
    
    return {
      ...state,
      coins: state.coins - amount
    };
  },

  // Add a joker to the player's collection
  ADD_JOKER: (state: PlayerEconomyState, action): PlayerEconomyState => {
    const joker: JokerConfig = action.payload.joker;
    
    // Check if player already owns this joker (prevent duplicates)
    const alreadyOwned = state.ownedJokers.some(owned => owned.id === joker.id);
    if (alreadyOwned) {
      console.warn(`⚠️ Player already owns joker: ${joker.id}`);
      return state;
    }
    
    console.log(`🃏 Adding joker to collection: ${joker.label}`);
    
    return {
      ...state,
      ownedJokers: [...state.ownedJokers, joker]
    };
  },

  // Remove a joker from the player's collection (if needed for balancing)
  REMOVE_JOKER: (state: PlayerEconomyState, action): PlayerEconomyState => {
    const jokerId = action.payload.jokerId;
    
    return {
      ...state,
      ownedJokers: state.ownedJokers.filter(joker => joker.id !== jokerId)
    };
  },

  // Upgrade a specific hand type
  UPGRADE_HAND: (state: PlayerEconomyState, action): PlayerEconomyState => {
    const handType = action.payload.handType;
    const currentLevel = state.handUpgrades[handType] || 0;
    
    console.log(`📈 Upgrading ${handType} from level ${currentLevel} to ${currentLevel + 1}`);
    
    return {
      ...state,
      handUpgrades: {
        ...state.handUpgrades,
        [handType]: currentLevel + 1
      }
    };
  },

  // Reset economy state (for new game or testing)
  RESET_ECONOMY: (): PlayerEconomyState => {
    console.log('🔄 Resetting economy state');
    return initialEconomyState;
  }

});

export default economyReducer; 