import { Bonus, BonusResult, BonusContext } from './types';

export const cardFaceChipBonus: Bonus = {
  id: 'cardFaceChipBonus',
  name: 'Card Face Chip Bonus',
  description: 'Bonus chips based on card faces',
  priority: 1, // First bonus to be applied
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate: (_context: BonusContext): BonusResult => {
    // Placeholder for now
    return {
      multiplier: 1,
      chips: 0,
      description: 'Card Face Bonus: Placeholder'
    };
  }
};
