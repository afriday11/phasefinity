import { HandLevel, HandType, HandLevelConfig } from '../types/scoreTypes';

export class HandLevelService {
  private handLevels: Map<HandType, HandLevel> = new Map();
  private readonly handConfigs: Record<HandType, HandLevelConfig> = {
    highCard: { levelMultiplier: 0, levelChips: 0, baseMultiplier: 1, baseChips: 0 },
    pair: { levelMultiplier: 1, levelChips: 5, baseMultiplier: 2, baseChips: 10 },
    twoPair: { levelMultiplier: 1, levelChips: 10, baseMultiplier: 3, baseChips: 20 },
    threeOfAKind: { levelMultiplier: 2, levelChips: 15, baseMultiplier: 4, baseChips: 30 },
    straight: { levelMultiplier: 2, levelChips: 20, baseMultiplier: 5, baseChips: 40 },
    flush: { levelMultiplier: 3, levelChips: 25, baseMultiplier: 6, baseChips: 50 },
    fullHouse: { levelMultiplier: 2, levelChips: 25, baseMultiplier: 4, baseChips: 40 },
    fourOfAKind: { levelMultiplier: 3, levelChips: 30, baseMultiplier: 7, baseChips: 60 },
    straightFlush: { levelMultiplier: 4, levelChips: 40, baseMultiplier: 8, baseChips: 100 },
  };

  constructor() {
    // Initialize all hands at level 1
    Object.keys(this.handConfigs).forEach(handType => {
      this.handLevels.set(handType as HandType, {
        level: 1,
        baseMultiplier: this.handConfigs[handType as HandType].baseMultiplier,
        runMultiplier: 1,
        timesPlayed: 0
      });
    });
  }

  public getHandLevel(handType: HandType): HandLevel {
    return this.handLevels.get(handType) || {
      level: 1,
      baseMultiplier: 1,
      runMultiplier: 1,
      timesPlayed: 0
    };
  }

  public incrementTimesPlayed(handType: HandType): void {
    const handLevel = this.getHandLevel(handType);
    handLevel.timesPlayed++;
    this.handLevels.set(handType, handLevel);
  }

  public upgradeHandBaseLevel(handType: HandType): void {
    const handLevel = this.getHandLevel(handType);
    const config = this.handConfigs[handType];
    
    handLevel.level++;
    handLevel.baseMultiplier += config.levelMultiplier;
    this.handLevels.set(handType, handLevel);
  }

  public upgradeHandRunMultiplier(handType: HandType): void {
    const handLevel = this.getHandLevel(handType);
    handLevel.runMultiplier++;
    this.handLevels.set(handType, handLevel);
  }

  public getTotalMultiplier(handType: HandType): number {
    const handLevel = this.getHandLevel(handType);
    return handLevel.baseMultiplier * handLevel.runMultiplier;
  }
}