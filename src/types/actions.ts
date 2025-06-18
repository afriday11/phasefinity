

import { Card } from "../store/game/gameSlice";
import { HandType } from "./scoreTypes";

// Game Actions
interface InitializeGameAction { type: 'INITIALIZE_GAME'; }
interface AddCardsAction { type: 'ADD_CARDS'; payload: Card[]; }
interface SelectCardAction { type: 'SELECT_CARD'; payload: { id: number }; }
interface ToggleCardSelectionAction { type: 'TOGGLE_CARD_SELECTION'; payload: { id: number }; }
interface PlayCardsAction { type: 'PLAY_CARDS'; payload: Card[]; }
interface DiscardCardsAction { type: 'DISCARD_CARDS'; payload: Card[]; }
interface DrawCardsAction { type: 'DRAW_CARDS'; payload: number; }
interface ShuffleDeckAction { type: 'SHUFFLE_DECK'; }
interface ResetGameAction { type: 'RESET'; }
interface SortHandAction { type: 'SORT_HAND'; }

export type GameAction =
  | InitializeGameAction
  | AddCardsAction
  | SelectCardAction
  | ToggleCardSelectionAction
  | PlayCardsAction
  | DiscardCardsAction
  | DrawCardsAction
  | ShuffleDeckAction
  | ResetGameAction
  | SortHandAction;

// Score Actions
interface UpdateScoreAction {
  type: 'UPDATE_SCORE';
  payload: {
    points: number;
    handType: HandType;
    chips: number;
    multiplier: number;
    bonusDescription: string;
  };
}
interface ResetScoreAction { type: 'RESET_SCORE'; }
interface NewRoundAction { type: 'NEW_ROUND'; }

export type ScoreAction =
  | UpdateScoreAction
  | ResetScoreAction
  | NewRoundAction;

// Level Actions
interface NextLevelAction { type: 'NEXT_LEVEL'; }
interface UseTurnAction { type: 'USE_TURN'; }
interface UseDiscardAction { type: 'USE_DISCARD'; }
interface GameOverAction { type: 'GAME_OVER'; }
interface ResetLevelAction { type: 'RESET_LEVEL'; }

export type LevelAction =
  | NextLevelAction
  | UseTurnAction
  | UseDiscardAction
  | GameOverAction
  | ResetLevelAction;

// HandLevels Actions
interface IncrementTimesPlayedAction { type: 'INCREMENT_TIMES_PLAYED'; payload: { handType: HandType }; }
interface UpgradeHandBaseLevelAction { type: 'UPGRADE_HAND_BASE_LEVEL'; payload: { handType: HandType }; }
interface UpgradeHandRunMultiplierAction { type: 'UPGRADE_HAND_RUN_MULTIPLIER'; payload: { handType: HandType }; }
interface ResetHandLevelsAction { type: 'RESET_HAND_LEVELS'; }

export type HandLevelsAction =
  | IncrementTimesPlayedAction
  | UpgradeHandBaseLevelAction
  | UpgradeHandRunMultiplierAction
  | ResetHandLevelsAction; 