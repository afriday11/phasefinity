/**
 * PowerupScreen Component for PhaseInfinity
 * 
 * This component displays a selection screen with 3 randomly chosen powerups
 * at the beginning of each level. Players can click to select a powerup or skip.
 * It's designed to be extensible for future powerup types beyond jokers.
 */

import { Powerup } from "../types/powerupTypes";
import { Joker } from "../types/jokerTypes";
import "./PowerupScreen.css";

interface PowerupScreenProps {
  isVisible: boolean;
  availablePowerups: Powerup[];
  onSelectPowerup: (powerup: Powerup) => void;
  onSkip: () => void;
}

function PowerupScreen({ isVisible, availablePowerups, onSelectPowerup, onSkip }: PowerupScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="powerup-screen-overlay">
      <div className="powerup-screen">
        <h2 className="powerup-title">Choose a Powerup</h2>
        
        <div className="powerup-options">
          {availablePowerups.map((powerup) => (
            <div 
              key={powerup.id} 
              className="powerup-option"
              onClick={() => onSelectPowerup(powerup)}
            >
              {powerup.type === 'joker' && (
                <div className="powerup-joker-card">
                  <div className="powerup-name">{powerup.joker.name}</div>
                  <div className="powerup-stats">
                    <span className="powerup-reward">
                      {powerup.joker.reward === 'mult' ? 'MULT' : 'CHIPS'}
                    </span>
                    <span className="powerup-value">+{powerup.joker.value}</span>
                  </div>
                  <div className="powerup-trigger">
                    {getJokerTriggerText(powerup.joker)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="powerup-skip-button" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}

/**
 * Helper function to generate readable trigger text for jokers
 * Reuses the logic from JokerDisplay component
 */
function getJokerTriggerText(joker: Joker): string {
  switch (joker.trigger) {
    case 'always':
      return 'Always active';
    case 'onScoreSuit':
      return `Per ${joker.suit} card`;
    case 'onHandType':
      return `On ${joker.handType}`;
    default:
      return 'Unknown trigger';
  }
}

export default PowerupScreen; 