import { Bonus } from './types';
import { BonusResult } from '../../types/scoreTypes';

export const cardFaceChipBonus: Bonus = {
  id: 'cardFaceChipBonus',
  name: 'Card Face Chip Bonus',
  description: 'Bonus chips based on card faces',
  priority: 1, // First bonus to be applied
  

  calculate: (): BonusResult => {
    // Placeholder for now
    return {
      chipBonus: 0,
      description: 'Card Face Bonus: Placeholder'
    };
  }
};
