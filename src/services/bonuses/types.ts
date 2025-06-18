import { Card } from '../../store/game/gameSlice';
import { ScoreCalculation } from '../../types/scoreTypes';

// this file contains the types for the bonuses, 
// including the bonus context and the bonus result.

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
