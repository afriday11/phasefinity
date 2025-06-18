import { HandLevel, HandType } from '../../types/scoreTypes';
import createReducer from '../../utils/createReducer';
import gameConfig from '../../config/gameConfig.json';
import { HandLevelsAction } from '../../types/actions';

// The state is a record mapping each hand type to its level information.
export type HandLevelsState = Record<HandType, HandLevel>;

// Helper function to create the initial state from the configuration file.
// This ensures that our state is initialized with the correct values from the game config.
const createInitialHandLevelsState = (): HandLevelsState => {
  const initialState: Partial<HandLevelsState> = {};
  const handTypes = Object.keys(gameConfig.hands) as HandType[];

  handTypes.forEach(handType => {
    const config = gameConfig.hands[handType];
    initialState[handType] = {
      level: 1,
      // baseMultiplier is the starting multiplier for a hand at level 1.
      baseMultiplier: config.baseMultiplier,
      // runMultiplier is for temporary, in-game boosts.
      runMultiplier: 1,
      timesPlayed: 0,
    };
  });

  return initialState as HandLevelsState;
};

export const initialHandLevelsState: HandLevelsState = createInitialHandLevelsState();

const handLevelsReducer = createReducer<HandLevelsState, HandLevelsAction>({
  // Action to increment the number of times a hand has been played.
  INCREMENT_TIMES_PLAYED: (state: HandLevelsState, action): HandLevelsState => {
    const { handType } = action.payload;
    const handLevel = state[handType];
    return {
      ...state,
      [handType]: {
        ...handLevel,
        timesPlayed: handLevel.timesPlayed + 1,
      },
    };
  },

  // Action to upgrade a hand's base level. This is a permanent upgrade.
  UPGRADE_HAND_BASE_LEVEL: (state: HandLevelsState, action): HandLevelsState => {
    const { handType } = action.payload;
    const handLevel = state[handType];
    const config = gameConfig.hands[handType];

    return {
      ...state,
      [handType]: {
        ...handLevel,
        level: handLevel.level + 1,
        baseMultiplier: handLevel.baseMultiplier + config.levelMultiplier,
      },
    };
  },

  // Action to upgrade a hand's run multiplier. This is a temporary boost for the current run.
  UPGRADE_HAND_RUN_MULTIPLIER: (state: HandLevelsState, action): HandLevelsState => {
    const { handType } = action.payload;
    const handLevel = state[handType];
    return {
      ...state,
      [handType]: {
        ...handLevel,
        runMultiplier: handLevel.runMultiplier + 1,
      },
    };
  },

  // Resets all hand levels to their initial state.
  RESET_HAND_LEVELS: (): HandLevelsState => {
    return initialHandLevelsState;
  }
});

export default handLevelsReducer; 