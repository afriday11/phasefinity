export type HandType = 
  | 'highCard' 
  | 'pair' 
  | 'twoPair' 
  | 'threeOfAKind' 
  | 'straight' 
  | 'flush' 
  | 'fullHouse' 
  | 'fourOfAKind' 
  | 'straightFlush';

export interface ScoreState {
  currentScore: number;
  highScore: number;
  lastPlayScore: number;
  lastPlayType: HandType | null;
  roundNumber: number;
  currentChips?: number;
  currentMultiplier?: number;
  bonusDescription?: string;
}

export interface ScoreAction {
  type: 'UPDATE_SCORE' | 'RESET_SCORE' | 'NEW_ROUND';
  payload?: {
    points?: number;
    handType?: HandType;
  };
}

export interface ScoreMultipliers {
  chips: number;
  multiplier: number;
}

export interface ScoreCalculation {
  baseChips: number;
  baseMultiplier: number;
  currentChips: number;
  currentMultiplier: number;
  handType: HandType;
  finalScore: number;
  bonuses: string;
}

export interface BonusResult {
  chipBonus?: number;
  multiplierBonus?: number;
  description: string;
}