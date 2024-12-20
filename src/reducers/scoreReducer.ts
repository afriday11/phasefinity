import { ScoreState, HandType } from "../types/scoreTypes";
import createReducer from "../utils/createReducer";

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

const scoreReducer = createReducer({
  UPDATE_SCORE: (
    state: ScoreState,
    payload: { points: number; handType: HandType; chips: number; multiplier: number; bonusDescription: string }
  ): ScoreState => {
    return {
      ...state,
      currentScore: state.currentScore + payload.points,
      highScore: Math.max(state.currentScore + payload.points, state.highScore),
      lastPlayScore: payload.points,
      lastPlayType: payload.handType,
      currentChips: payload.chips,
      currentMultiplier: payload.multiplier,
      bonusDescription: payload.bonusDescription
    };
  },

  RESET_SCORE: (): ScoreState => {
    return initialScoreState;
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
