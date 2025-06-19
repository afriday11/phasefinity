/**
 * Powerup System Types for PhaseInfinity
 * 
 * This file defines types for the powerup selection system,
 * including jokers and future powerup types like consumables.
 * The powerup screen appears at the beginning of each level.
 */

import { Joker } from './jokerTypes';

/** Types of powerups that can be offered to players */
export type PowerupType = 'joker' | 'consumable' | 'upgrade';

/** Base interface for all powerup items */
export interface BasePowerup {
  id: string;
  type: PowerupType;
  name: string;
  description: string;
}

/** Joker powerup - wraps a Joker for the powerup system */
export interface JokerPowerup extends BasePowerup {
  type: 'joker';
  joker: Joker;
}

/** Union type for all powerup variants */
export type Powerup = JokerPowerup;

/** State for the powerup selection screen */
export interface PowerupState {
  isVisible: boolean;           // Whether the powerup screen is currently shown
  availablePowerups: Powerup[]; // Array of 3 powerups to choose from
  selectedPowerup: Powerup | null; // The powerup the player selected (if any)
}

/** Actions for powerup state management */
export interface ShowPowerupsAction {
  type: 'SHOW_POWERUPS';
  payload: {
    powerups: Powerup[];
  };
}

export interface SelectPowerupAction {
  type: 'SELECT_POWERUP';
  payload: {
    powerup: Powerup;
  };
}

export interface SkipPowerupsAction {
  type: 'SKIP_POWERUPS';
}

export interface ClosePowerupsAction {
  type: 'CLOSE_POWERUPS';
}

export type PowerupAction = 
  | ShowPowerupsAction 
  | SelectPowerupAction 
  | SkipPowerupsAction 
  | ClosePowerupsAction; 