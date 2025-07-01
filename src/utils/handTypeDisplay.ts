/**
 * Hand Type Display Utility for Phase 10 Terminology
 * 
 * This utility converts internal poker hand type names to Phase 10 display names
 * for the UI. The internal logic continues to use poker terms, but users see
 * Phase 10 terminology.
 */

import { HandType } from '../types/scoreTypes';

/**
 * Maps internal hand type names to Phase 10 display names
 * @param handType The internal hand type identifier
 * @returns The Phase 10 display name for the hand type
 */
export function getPhase10HandTypeName(handType: HandType): string {
  switch (handType) {
    case 'pair':
      return 'Set of 2';
    case 'twoPair':
      return 'Two Sets of 2';
    case 'threeOfAKind':
      return 'Set of 3';
    case 'fourOfAKind':
      return 'Set of 4';
    case 'straight':
      return 'Run of 5';
    case 'fullHouse':
      return 'A Set of 3 and a Set of 2';
    case 'flush':
      return 'Flush';
    case 'straightFlush':
      return 'Straight Flush';
    case 'highCard':
      return 'High Card';
    default:
      // Fallback to original name if unknown
      return handType;
  }
} 