import scoringConfig from '../config/scoring.json';
import { Card } from '../reducers/gameReducer';
import { HandType, ScoreCalculation } from '../types/scoreTypes';
import { Bonus } from './bonuses/types';
import { cardFaceChipBonus } from './bonuses/cardFaceChipBonus';

// List of all bonuses in priority order
const bonuses: Bonus[] = [
  cardFaceChipBonus,
  // Add more bonuses here
];

export class ScoreCalculator {
  private calculation: ScoreCalculation;

  constructor(handType: HandType, cards: Card[]) {
    const baseScore = scoringConfig.baseScores[handType];
    
    this.calculation = {
      baseChips: baseScore.chips,
      baseMultiplier: baseScore.multiplier,
      currentChips: baseScore.chips,
      currentMultiplier: baseScore.multiplier,
      handType: handType,
      finalScore: 0
    };
  }

  public calculateScore(cards: Card[]): ScoreCalculation {
    // Apply bonuses in order
    bonuses.forEach(bonus => {
      const context = { cards, currentScore: this.calculation };
      const result = bonus.calculate(context);
      
      // Apply chip bonus
      if (result.chipBonus) {
        this.calculation.currentChips += result.chipBonus;
      }
      
      // Apply multiplier bonus
      if (result.multiplierBonus) {
        this.calculation.currentMultiplier += result.multiplierBonus;
      }
    });

    // Calculate final score
    this.calculation.finalScore = 
      this.calculation.currentChips * this.calculation.currentMultiplier;

    return this.calculation;
  }
}
