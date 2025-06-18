import { LevelState } from '../types/levelTypes';
import './LevelDisplay.css';

interface LevelDisplayProps {
  levelState: LevelState;
  currentScore: number;
}

export function LevelDisplay({ levelState, currentScore }: LevelDisplayProps) {
  const progressPercentage = Math.min((currentScore / levelState.requiredScore) * 100, 100);
  
  return (
    <div className="level-display">
      <div className="level-info">
        <h2>Level {levelState.currentLevel}</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="level-stats">
          <span>Score: {currentScore} / {levelState.requiredScore}</span>
          <span>Turns: {levelState.turnsRemaining}</span>
          <span>Discards: {levelState.discardsRemaining}</span>
        </div>
      </div>
    </div>
  );
} 