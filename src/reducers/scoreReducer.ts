import { ScoreState, ScoreAction } from '../types/scoreTypes';
import createReducer from '../utils/createReducer';

export const initialScoreState: ScoreState = {
  currentScore: 0,
  highScore: 0,
  lastPlayScore: 0,
  lastPlayType: null,
  roundNumber: 1
};

const scoreReducer = createReducer({
  UPDATE_SCORE: (state: ScoreState, payload: { points: number; handType: HandType }): ScoreState => {
    const newCurrentScore = state.currentScore + payload.points;
    return {
      ...state,
      currentScore: newCurrentScore,
      highScore: Math.max(newCurrentScore, state.highScore),
      lastPlayScore: payload.points,
      lastPlayType: payload.handType
    };
  },

  RESET_SCORE: (state: ScoreState): ScoreState => {
    return initialScoreState;
  },

  NEW_ROUND: (state: ScoreState): ScoreState => {
    return {
      ...state,
      roundNumber: state.roundNumber + 1,
      lastPlayScore: 0,
      lastPlayType: null
    };
  }
});

export default scoreReducer;