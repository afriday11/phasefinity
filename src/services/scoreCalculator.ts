import { Card } from "../reducers/gameReducer";
import { HandType, ScoreCalculation, BonusResult } from "../types/scoreTypes";
import { HandLevelService } from "../services/handLevelService";
import scoreConfig from "../config/scoreConfig.json";

export class ScoreCalculator {
  private handType: HandType;
  private cards: Card[];
  private baseChips: number;
  private baseMultiplier: number;
  private handLevelService: HandLevelService;

  constructor(handType: HandType, cards: Card[], handLevelService: HandLevelService) {
    this.handType = handType;
    this.cards = cards;
    this.handLevelService = handLevelService;
    
    // Correctly access baseChips from handScores
    this.baseChips = scoreConfig.handScores[handType].baseChips || 0;
    this.baseMultiplier = scoreConfig.handScores[handType].baseMultiplier || 1;

    // Update base values using level service
    const totalMultiplier = this.handLevelService.getTotalMultiplier(handType);
    this.baseMultiplier *= totalMultiplier;
    
    // Track that this hand was played
    this.handLevelService.incrementTimesPlayed(handType);
  }

  public calculateScore(): ScoreCalculation {
    // Start with base values
    let currentChips = this.baseChips;
    let currentMultiplier = this.baseMultiplier;
    const bonusDescriptions: string[] = [];

    // Step 1: Apply base hand score
    bonusDescriptions.push(`Base hand: ${this.handType} (${currentChips} chips)`);

    // Step 2: Calculate card value bonuses (left to right)
    const cardBonuses = this.calculateCardValueBonuses();
    if (cardBonuses.chipBonus) {
      currentChips += cardBonuses.chipBonus;
    }
    if (cardBonuses.description) {
      bonusDescriptions.push(cardBonuses.description);
    }

    // Step 3: Apply other bonuses (Aces, Face cards, Suits)
    const otherBonuses = this.calculateBonuses();
    if (otherBonuses.chipBonus) {
      currentChips += otherBonuses.chipBonus;
    }
    if (otherBonuses.multiplierBonus) {
      currentMultiplier *= otherBonuses.multiplierBonus;
    }
    if (otherBonuses.description) {
      bonusDescriptions.push(otherBonuses.description);
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
      bonuses: bonusDescriptions.join(' • ')
    };
  }

  private calculateCardValueBonuses(): BonusResult {
    let chipBonus = 0;
    const bonusDescriptions: string[] = [];

    // Process cards left to right
    this.cards.forEach((card) => {
      let cardBonus = 0;
      
      // Convert face cards to their bonus values
      if (card.value === 14) {  // Ace
        cardBonus = 11;
      } else if (card.value >= 11) {  // Face cards
        cardBonus = 10;
      } else {  // Number cards
        cardBonus = card.value;
      }

      chipBonus += cardBonus;
      bonusDescriptions.push(`${card.label}: +${cardBonus}`);
    });

    return {
      chipBonus,
      description: bonusDescriptions.length > 0 
        ? `Card bonuses: ${bonusDescriptions.join(', ')}` 
        : ''
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
