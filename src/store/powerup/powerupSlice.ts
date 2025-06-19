/**
 * Powerup Slice for PhaseInfinity
 * 
 * This slice manages the state for the powerup selection screen
 * that appears at the beginning of each level, allowing players
 * to choose from 3 randomly selected powerups.
 */

import { PowerupState, PowerupAction } from "../../types/powerupTypes";
import createReducer from "../../utils/createReducer";

export const initialPowerupState: PowerupState = {
  isVisible: false,
  availablePowerups: [],
  selectedPowerup: null,
};

const powerupReducer = createReducer<PowerupState, PowerupAction>({
  SHOW_POWERUPS: (state: PowerupState, action): PowerupState => {
    console.log("🎁 SHOW_POWERUPS: Displaying powerup selection screen");
    return {
      ...state,
      isVisible: true,
      availablePowerups: action.payload.powerups,
      selectedPowerup: null, // Reset any previous selection
    };
  },

  SELECT_POWERUP: (state: PowerupState, action): PowerupState => {
    console.log("✨ SELECT_POWERUP: Player selected powerup:", action.payload.powerup.name);
    return {
      ...state,
      selectedPowerup: action.payload.powerup,
      isVisible: false, // Close the screen after selection
    };
  },

  SKIP_POWERUPS: (state: PowerupState): PowerupState => {
    console.log("⏭️ SKIP_POWERUPS: Player skipped powerup selection");
    return {
      ...state,
      isVisible: false,
      selectedPowerup: null,
    };
  },

  CLOSE_POWERUPS: (state: PowerupState): PowerupState => {
    console.log("❌ CLOSE_POWERUPS: Powerup screen closed");
    return {
      ...state,
      isVisible: false,
    };
  },
});

export default powerupReducer; 