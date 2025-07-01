// Level slice manages the level of the game, including: 
// current level, turns remaining, discards remaining, required score, and is game over.
// levelSlice interacts with levelService to get the level config.

//import { LevelState, LevelAction } from '../types/levelTypes';
import * as levelService from '../../services/levelService';
import { LevelState } from '../../types/levelTypes';
import createReducer from '../../utils/createReducer';
import { LevelAction } from '../../types/actions';

export const initialLevelState: LevelState = {
  currentLevel: 1,
  turnsRemaining: 4,
  discardsRemaining: 3,
  requiredScore: levelService.getLevelConfig(1).requiredScore,
  isGameOver: false
};

const levelReducer = createReducer<LevelState, LevelAction>({
  NEXT_LEVEL: (state: LevelState): LevelState => {
    const nextLevel = state.currentLevel + 1;
    console.log("🎯 NEXT_LEVEL: Moving from level", state.currentLevel, "to level", nextLevel);
    
    try {
      const config = levelService.getLevelConfig(nextLevel);
      console.log("✅ Next level config loaded:", config);
      
      return {
        currentLevel: nextLevel,
        turnsRemaining: config.turns,
        discardsRemaining: config.discards,
        requiredScore: config.requiredScore,
        isGameOver: false
      };
    } catch (error) {
      console.error("❌ Error loading next level config:", error);
      // If we can't load the next level, mark game as complete
      console.log("🏆 Game completed - no more levels available!");
      return {
        ...state,
        isGameOver: true
      };
    }
  },

  USE_TURN: (state: LevelState): LevelState => {
    console.log("🎯 USE_TURN: turns remaining before:", state.turnsRemaining);
    const newState = {
      ...state,
      turnsRemaining: state.turnsRemaining - 1
    };
    console.log("🎯 USE_TURN: turns remaining after:", newState.turnsRemaining);
    return newState;
  },

  USE_DISCARD: (state: LevelState): LevelState => {
    console.log("🗑️ USE_DISCARD: discards remaining before:", state.discardsRemaining);
    const newState = {
      ...state,
      discardsRemaining: state.discardsRemaining - 1
    };
    console.log("🗑️ USE_DISCARD: discards remaining after:", newState.discardsRemaining);
    return newState;
  },

  GAME_OVER: (state: LevelState): LevelState => {
    console.log("💀 GAME_OVER action triggered");
    return {
      ...state,
      isGameOver: true
    };
  },

  RESET_LEVEL: (): LevelState => {
    console.log("🔄 RESET_LEVEL: Resetting to initial level state");
    return initialLevelState;
  }
});

export default levelReducer; 