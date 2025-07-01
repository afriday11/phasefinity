/**
 * This module provides functions for accessing player level configuration.
 * It reads from the central game configuration file.
 */
import gameConfig from '../config/gameConfig.json';
import { LevelConfig } from '../types/levelTypes';

const levels: LevelConfig[] = gameConfig.playerLevels.levels;

/**
 * Retrieves the configuration for a specific player level.
 *
 * @param levelNumber The level to look up.
 * @returns The configuration for the specified level.
 * @throws If the level configuration is not found.
 */
export function getLevelConfig(levelNumber: number): LevelConfig {
  const config = levels.find(l => l.level === levelNumber);
  if (!config) {
    throw new Error(`Configuration for level ${levelNumber} not found.`);
  }
  return config;
}

/**
 * Provides the default number of turns per level.
 */
export const defaultTurnsPerLevel = gameConfig.playerLevels.defaultTurnsPerLevel;

/**
 * Provides the default number of discards per level.
 */
export const defaultDiscardsPerLevel = gameConfig.playerLevels.defaultDiscardsPerLevel;

export function checkLevelComplete(score: number, level: number): boolean {
  const config = getLevelConfig(level);
  return score >= config.requiredScore;
}

export function checkGameOver(turnsRemaining: number, score: number, requiredScore: number): boolean {
  return turnsRemaining === 0 && score < requiredScore;
} 