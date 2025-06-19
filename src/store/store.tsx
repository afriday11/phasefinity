import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import gameReducer, { State as GameState } from './game/gameSlice';
import scoreReducer, { initialScoreState } from './score/scoreSlice';
import levelReducer, { initialLevelState } from './level/levelSlice';
import handLevelsReducer, { initialHandLevelsState, HandLevelsState } from './handLevels/handLevelsSlice';
import economyReducer, { initialEconomyState } from './economy/economySlice';
import { ScoreState } from '../types/scoreTypes';
import { LevelState } from '../types/levelTypes';
import { PlayerEconomyState } from '../types/economyTypes';
import { GameAction, ScoreAction, LevelAction, HandLevelsAction, EconomyAction } from '../types/actions.ts';

// The store is the main component that manages the game state.
// It uses the useReducer hook to manage the state.
// It also uses the createContext hook to create the context.
// It also uses the AppProvider component to provide the context to the app.
// It also uses the useAppContext hook to get the game state and dispatch actions.

// 1. Define the complete application state
export interface AppState {
  game: GameState;
  score: ScoreState;
  level: LevelState;
  handLevels: HandLevelsState;
  economy: PlayerEconomyState;
}

// Combine all possible action types
type AppAction = GameAction | ScoreAction | LevelAction | HandLevelsAction | EconomyAction;

// 2. Define the initial state for the entire application
const initialState: AppState = {
  // The game state is initialized by its reducer's INITIALIZE_GAME action,
  // so we provide a minimal starting shape here.
  game: {
    gameStarted: false,
    allowInput: false,
    cards: [],
    jokers: [],
  },
  score: initialScoreState,
  level: initialLevelState,
  handLevels: initialHandLevelsState,
  economy: initialEconomyState,
};

// 3. Create the root reducer
// This reducer delegates actions to the specific slice reducers
const rootReducer = (state: AppState, action: AppAction): AppState => {
  // Route actions to the appropriate slice reducers based on action type
  switch (action.type) {
    // Game actions
    case 'INITIALIZE_GAME':
    case 'ADD_CARDS':
    case 'SELECT_CARD':
    case 'TOGGLE_CARD_SELECTION':
    case 'PLAY_CARDS':
    case 'DISCARD_CARDS':
    case 'DRAW_CARDS':
    case 'SHUFFLE_DECK':
    case 'RESET':
    case 'SORT_HAND':
    case 'EQUIP_JOKER':
    case 'UNEQUIP_JOKER':
    case 'CLEAR_EQUIPPED_JOKERS':
      return {
        ...state,
        game: gameReducer(state.game, action as GameAction),
      };

    // Score actions
    case 'UPDATE_SCORE':
    case 'RESET_SCORE':
    case 'NEW_ROUND':
      return {
        ...state,
        score: scoreReducer(state.score, action as ScoreAction),
      };

    // Level actions
    case 'NEXT_LEVEL':
    case 'USE_TURN':
    case 'USE_DISCARD':
    case 'GAME_OVER':
    case 'RESET_LEVEL':
      return {
        ...state,
        level: levelReducer(state.level, action as LevelAction),
      };

    // Hand levels actions
    case 'INCREMENT_TIMES_PLAYED':
    case 'UPGRADE_HAND_BASE_LEVEL':
    case 'UPGRADE_HAND_RUN_MULTIPLIER':
    case 'RESET_HAND_LEVELS':
      return {
        ...state,
        handLevels: handLevelsReducer(state.handLevels, action as HandLevelsAction),
      };

    // Economy actions
    case 'GRANT_COINS':
    case 'SPEND_COINS':
    case 'ADD_JOKER':
    case 'REMOVE_JOKER':
    case 'UPGRADE_HAND':
    case 'RESET_ECONOMY':
      return {
        ...state,
        economy: economyReducer(state.economy, action as EconomyAction),
      };

    default:
      // For unknown actions, return the current state unchanged
      console.warn(`Unknown action type: ${(action as { type: string }).type}`);
      return state;
  }
};

// 4. Create the context
interface AppContextProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// 5. Create the provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // The first action to dispatch is to initialize the game, which sets up the deck.
  React.useEffect(() => {
    console.log("🚀 Initializing game state...");
    dispatch({ type: 'INITIALIZE_GAME' });
    console.log("✅ Game initialization dispatched");
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 6. Create a custom hook for easy context access
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 