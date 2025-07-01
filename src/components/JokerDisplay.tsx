/**
 * JokerDisplay Component for PhaseInfinity
 * 
 * This component displays the player's equipped jokers in 5 slots
 * at the top center of the screen. It shows empty slots for unequipped
 * positions to communicate the 5-joker limit to players.
 */

import { Joker } from "../types/jokerTypes";
import { getPhase10HandTypeName } from "../utils/handTypeDisplay";
import "./JokerDisplay.css";

interface JokerDisplayProps {
  equippedJokers: Joker[];
}

function JokerDisplay({ equippedJokers }: JokerDisplayProps) {
  // Create array of 5 slots, filling with jokers or null for empty slots
  const jokerSlots: (Joker | null)[] = [];
  for (let i = 0; i < 5; i++) {
    jokerSlots[i] = equippedJokers[i] || null;
  }

  return (
    <div className="joker-display">
      <div className="joker-slots">
        {jokerSlots.map((joker, index) => (
          <div key={index} className="joker-slot">
            {joker ? (
              <div className="joker-card">
                <div className="joker-name">{joker.name}</div>
                <div className="joker-stats">
                  <span className="joker-reward">
                    {joker.reward === 'mult' ? 'MULT' : 'CHIPS'}
                  </span>
                  <span className="joker-value">+{joker.value}</span>
                </div>
                <div className="joker-trigger">
                  {getJokerTriggerText(joker)}
                </div>
              </div>
            ) : (
              <div className="joker-slot-empty">
                <span className="empty-slot-text">Empty</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Helper function to generate readable trigger text for jokers
 * @param joker The joker to generate trigger text for
 * @returns Human-readable description of when the joker triggers using Phase 10 terminology
 */
function getJokerTriggerText(joker: Joker): string {
  switch (joker.trigger) {
    case 'always':
      return 'Always active';
    case 'onScoreSuit':
      return `Per ${joker.suit} card`;
    case 'onHandType':
      return `On ${getPhase10HandTypeName(joker.handType!)}`;
    default:
      return 'Unknown trigger';
  }
}

export default JokerDisplay; 