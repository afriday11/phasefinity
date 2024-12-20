import { ScoreState } from "../types/scoreTypes";
import "./ScoreDisplay.css";

interface ScoreDisplayProps {
  score: ScoreState;
}

function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="score-display">
      {score.currentChips && score.currentMultiplier && (
        <div className="score-calculation">
          <div className="score-item">
            <span className="score-label">Chips:</span>
            <span className="score-value">{score.currentChips}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Multiplier:</span>
            <span className="score-value">x{score.currentMultiplier.toFixed(1)}</span>
          </div>
          {score.bonusDescription && (
            <div className="score-item score-item--bonus">
              <span className="score-value">{score.bonusDescription}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="score-item">
        <span className="score-label">Score:</span>
        <span className="score-value">{score.currentScore}</span>
      </div>
      <div className="score-item">
        <span className="score-label">High Score:</span>
        <span className="score-value">{score.highScore}</span>
      </div>
      {score.lastPlayScore > 0 && (
        <div className="score-item score-item--highlight">
          <span className="score-label">{score.lastPlayType}:</span>
          <span className="score-value">+{score.lastPlayScore}</span>
        </div>
      )}
      <div className="score-item">
        <span className="score-label">Round:</span>
        <span className="score-value">{score.roundNumber}</span>
      </div>
    </div>
  );
}

export default ScoreDisplay;
