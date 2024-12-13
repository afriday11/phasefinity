import React from 'react';
import { ScoreState } from '../types/scoreTypes';
import './ScoreDisplay.css';

interface ScoreDisplayProps {
  score: ScoreState;
}

function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="score-display">
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
