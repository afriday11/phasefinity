import { Card } from '../../reducers/gameReducer';
import { ScoreCalculation } from '../../types/scoreTypes';

export interface BonusContext {
  cards: Card[];
  currentScore: ScoreCalculation;
}

export interface Bonus {
  id: string;
  name: string;
  description: string;
  priority: number;
  calculate: (context: BonusContext) => BonusResult;
}
