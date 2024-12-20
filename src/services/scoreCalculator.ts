import { Card } from "../reducers/gameReducer";
import { HandType, ScoreCalculation, BonusResult } from "../types/scoreTypes";
import scoreConfig from "../config/scoreConfig.json";

export class ScoreCalculator {
  private handType: HandType;
  private cards: Card[];
  private baseChips: number;
  private baseMultiplier: number;

  constructor(handType: HandType, cards: Card[]) {
    this.handType = handType;
    this.cards = cards;
    this.baseChips = scoreConfig.handScores[handType].baseChips;
    this.baseMultiplier = scoreConfig.handScores[handType].baseMultiplier;
  }

  public calculateScore(): ScoreCalculation {
    // Start with base values
    let currentChips = this.baseChips;
    let currentMultiplier = this.baseMultiplier;

    // Apply bonuses
    const bonuses = this.calculateBonuses();
    
    // Apply chip bonuses
    if (bonuses.chipBonus) {
      currentChips += bonuses.chipBonus;
    }

    // Apply multiplier bonuses
    if (bonuses.multiplierBonus) {
      currentMultiplier *= bonuses.multiplierBonus;
    }

    // Calculate final score
    const finalScore = Math.floor(currentChips * currentMultiplier);

    return {
      baseChips: this.baseChips,
      baseMultiplier: this.baseMultiplier,
      currentChips,
      currentMultiplier,
      handType: this.handType,
      finalScore,
      bonuses: bonuses.description
    };
  }

  private calculateBonuses(): BonusResult {
    const result: BonusResult = {
      description: ""
    };

    // Check for high card bonuses
    const hasAce = this.cards.some(card => card.value === 14);
    const hasFaceCard = this.cards.some(card => card.value >= 11 && card.value <= 13);

    if (hasAce) {
      result.multiplierBonus = scoreConfig.bonuses.highCardBonus.ace;
      result.description += "Ace bonus! ";
    } else if (hasFaceCard) {
      result.multiplierBonus = scoreConfig.bonuses.highCardBonus.faceCard;
      result.description += "Face card bonus! ";
    }

    // Check for suit bonuses
    const allSameSuit = this.cards.every(card => card.suit === this.cards[0].suit);
    if (allSameSuit) {
      const suitBonus = scoreConfig.bonuses.suitBonus[this.cards[0].suit as keyof typeof scoreConfig.bonuses.suitBonus];
      if (suitBonus) {
        result.multiplierBonus = (result.multiplierBonus || 1) * suitBonus;
        result.description += `${this.cards[0].suit} suit bonus! `;
      }
    }

    return result;
  }
}
