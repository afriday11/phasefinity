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
}

export interface ScoreAction {
  type: 'UPDATE_SCORE' | 'RESET_SCORE' | 'NEW_ROUND';
  payload?: {
    points?: number;
    handType?: HandType;
  };
}