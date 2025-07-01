// This file contains the action types for the game, including the game, score, and level actions.

import { Card } from "../store/game/gameSlice";
import { HandType } from "./scoreTypes";
import { JokerConfig } from "./economyTypes";
import { Joker } from "./jokerTypes";

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
interface EquipJokerAction { type: 'EQUIP_JOKER'; payload: { joker: Joker }; }
interface UnequipJokerAction { type: 'UNEQUIP_JOKER'; payload: { jokerId: number }; }
interface ClearEquippedJokersAction { type: 'CLEAR_EQUIPPED_JOKERS'; }

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
  | SortHandAction
  | EquipJokerAction
  | UnequipJokerAction
  | ClearEquippedJokersAction;

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

// Economy Actions
interface GrantCoinsAction { type: 'GRANT_COINS'; payload: { amount: number; reason?: string }; }
interface SpendCoinsAction { type: 'SPEND_COINS'; payload: { amount: number; reason?: string }; }
interface AddJokerAction { type: 'ADD_JOKER'; payload: { joker: JokerConfig }; }
interface RemoveJokerAction { type: 'REMOVE_JOKER'; payload: { jokerId: string }; }
interface UpgradeHandAction { type: 'UPGRADE_HAND'; payload: { handType: string }; }
interface ResetEconomyAction { type: 'RESET_ECONOMY'; }

export type EconomyAction =
  | GrantCoinsAction
  | SpendCoinsAction
  | AddJokerAction
  | RemoveJokerAction
  | UpgradeHandAction
  | ResetEconomyAction;

// Re-export PowerupAction for store integration
export type { PowerupAction } from "./powerupTypes"; 