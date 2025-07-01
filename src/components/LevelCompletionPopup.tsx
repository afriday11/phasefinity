/**
 * Level Completion Popup Component
 * 
 * This component displays a popup when a player completes or fails a level.
 * It shows the win/loss status, coin earnings breakdown, and provides a 
 * continue button to proceed to the next level or restart.
 */

import React from 'react';
import { calculateLevelCompletionCoins } from '../services/coinService';
import { COIN_REWARDS } from '../types/economyTypes';
import './LevelCompletionPopup.css';

interface LevelCompletionPopupProps {
  isVisible: boolean;
  isWin: boolean;
  level: number;
  handsRemaining: number;
  onContinue: () => void;
}

/**
 * LevelCompletionPopup shows results of level completion with coin breakdown
 */
export const LevelCompletionPopup: React.FC<LevelCompletionPopupProps> = ({
  isVisible,
  isWin,
  level,
  handsRemaining,
  onContinue
}) => {
  if (!isVisible) return null;

  const baseReward = COIN_REWARDS.levelCompletion;
  const efficiencyBonus = handsRemaining * COIN_REWARDS.unusedHandBonus;
  const totalCoins = isWin ? calculateLevelCompletionCoins(handsRemaining) : 0;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2 className={isWin ? 'win-text' : 'lose-text'}>
            {isWin ? '🎉 You Win!' : '💀 You Lose!'}
          </h2>
          <p className="level-text">Level {level} {isWin ? 'Complete' : 'Failed'}</p>
        </div>

        {isWin && (
          <div className="coin-earnings">
            <h3>💰 You Earned: {totalCoins} coins</h3>
            <div className="coin-breakdown">
              <div className="coin-line">
                <span>Level completion:</span>
                <span>{baseReward} coins</span>
              </div>
              {efficiencyBonus > 0 && (
                <div className="coin-line bonus">
                  <span>Efficiency bonus ({handsRemaining} hands unused):</span>
                  <span>{efficiencyBonus} coins</span>
                </div>
              )}
              <hr className="breakdown-divider" />
              <div className="coin-line total">
                <span>Total:</span>
                <span>{totalCoins} coins</span>
              </div>
            </div>
          </div>
        )}

        {!isWin && (
          <div className="failure-message">
            <p>Better luck next time!</p>
            <p>Try upgrading your hands or using a different strategy.</p>
          </div>
        )}

        <button 
          className="continue-button"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelCompletionPopup; 