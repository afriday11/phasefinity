// Score slice manages the score of the game, including: 
// current score, high score, last play score, last play type, 
// round number, current chips, current multiplier, and bonus description.


import { ScoreState } from "../../types/scoreTypes";
import createReducer from "../../utils/createReducer";
import { ScoreAction } from '../../types/actions';

export const initialScoreState: ScoreState = {
  currentScore: 0,
  highScore: 0,
  lastPlayScore: 0,
  lastPlayType: null,
  roundNumber: 1,
  currentChips: 0,
  currentMultiplier: 1,
  bonusDescription: ''
};

const scoreReducer = createReducer<ScoreState, ScoreAction>({
  UPDATE_SCORE: (
    state: ScoreState,
    action
  ): ScoreState => {
    return {
      ...state,
      currentScore: state.currentScore + action.payload.points,
      highScore: Math.max(state.currentScore + action.payload.points, state.highScore),
      lastPlayScore: action.payload.points,
      lastPlayType: action.payload.handType,
      currentChips: action.payload.chips,
      currentMultiplier: action.payload.multiplier,
      bonusDescription: action.payload.bonusDescription
    };
  },

  RESET_SCORE: (state): ScoreState => {
    return { ...initialScoreState, highScore: state.highScore };
  },

  NEW_ROUND: (state: ScoreState): ScoreState => {
    return {
      ...state,
      roundNumber: state.roundNumber + 1,
      lastPlayScore: 0,
      lastPlayType: null,
    };
  },
});

export default scoreReducer;
