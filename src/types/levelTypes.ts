export interface LevelConfig {
  level: number;
  requiredScore: number;
  turns: number;
  discards: number;
}

export interface LevelState {
  currentLevel: number;
  turnsRemaining: number;
  discardsRemaining: number;
  requiredScore: number;
  isGameOver: boolean;
}

// Action types: this function is used to dispatch actions to the reducer
export interface LevelAction {
  type: 'NEXT_LEVEL' | 'RESET_LEVEL' | 'USE_TURN' | 'USE_DISCARD' | 'GAME_OVER';
  payload?: LevelState;
} 