import { isPhase10Mode } from './utils/handTypeDisplay';

/**
 * Creates a standard 52-card deck
 * @returns Array of card objects
 */
function createStandardDeck() {
  return [
    { label: "2", suit: "hearts", suitEmoji: "♥️", value: 2 },
    { label: "3", suit: "hearts", suitEmoji: "♥️", value: 3 },
    { label: "4", suit: "hearts", suitEmoji: "♥️", value: 4 },
    { label: "5", suit: "hearts", suitEmoji: "♥️", value: 5 },
    { label: "6", suit: "hearts", suitEmoji: "♥️", value: 6 },
    { label: "7", suit: "hearts", suitEmoji: "♥️", value: 7 },
    { label: "8", suit: "hearts", suitEmoji: "♥️", value: 8 },
    { label: "9", suit: "hearts", suitEmoji: "♥️", value: 9 },
    { label: "10", suit: "hearts", suitEmoji: "♥️", value: 10 },
    { label: "J", suit: "hearts", suitEmoji: "♥️", value: 11 },
    { label: "Q", suit: "hearts", suitEmoji: "♥️", value: 12 },
    { label: "K", suit: "hearts", suitEmoji: "♥️", value: 13 },
    { label: "A", suit: "hearts", suitEmoji: "♥️", value: 14 },
    { label: "2", suit: "spades", suitEmoji: "♠️", value: 2 },
    { label: "3", suit: "spades", suitEmoji: "♠️", value: 3 },
    { label: "4", suit: "spades", suitEmoji: "♠️", value: 4 },
    { label: "5", suit: "spades", suitEmoji: "♠️", value: 5 },
    { label: "6", suit: "spades", suitEmoji: "♠️", value: 6 },
    { label: "7", suit: "spades", suitEmoji: "♠️", value: 7 },
    { label: "8", suit: "spades", suitEmoji: "♠️", value: 8 },
    { label: "9", suit: "spades", suitEmoji: "♠️", value: 9 },
    { label: "10", suit: "spades", suitEmoji: "♠️", value: 10 },
    { label: "J", suit: "spades", suitEmoji: "♠️", value: 11 },
    { label: "Q", suit: "spades", suitEmoji: "♠️", value: 12 },
    { label: "K", suit: "spades", suitEmoji: "♠️", value: 13 },
    { label: "A", suit: "spades", suitEmoji: "♠️", value: 14 },
    { label: "2", suit: "clubs", suitEmoji: "♣️", value: 2 },
    { label: "3", suit: "clubs", suitEmoji: "♣️", value: 3 },
    { label: "4", suit: "clubs", suitEmoji: "♣️", value: 4 },
    { label: "5", suit: "clubs", suitEmoji: "♣️", value: 5 },
    { label: "6", suit: "clubs", suitEmoji: "♣️", value: 6 },
    { label: "7", suit: "clubs", suitEmoji: "♣️", value: 7 },
    { label: "8", suit: "clubs", suitEmoji: "♣️", value: 8 },
    { label: "9", suit: "clubs", suitEmoji: "♣️", value: 9 },
    { label: "10", suit: "clubs", suitEmoji: "♣️", value: 10 },
    { label: "J", suit: "clubs", suitEmoji: "♣️", value: 11 },
    { label: "Q", suit: "clubs", suitEmoji: "♣️", value: 12 },
    { label: "K", suit: "clubs", suitEmoji: "♣️", value: 13 },
    { label: "A", suit: "clubs", suitEmoji: "♣️", value: 14 },
    { label: "2", suit: "diamonds", suitEmoji: "♦️", value: 2 },
    { label: "3", suit: "diamonds", suitEmoji: "♦️", value: 3 },
    { label: "4", suit: "diamonds", suitEmoji: "♦️", value: 4 },
    { label: "5", suit: "diamonds", suitEmoji: "♦️", value: 5 },
    { label: "6", suit: "diamonds", suitEmoji: "♦️", value: 6 },
    { label: "7", suit: "diamonds", suitEmoji: "♦️", value: 7 },
    { label: "8", suit: "diamonds", suitEmoji: "♦️", value: 8 },
    { label: "9", suit: "diamonds", suitEmoji: "♦️", value: 9 },
    { label: "10", suit: "diamonds", suitEmoji: "♦️", value: 10 },
    { label: "J", suit: "diamonds", suitEmoji: "♦️", value: 11 },
    { label: "Q", suit: "diamonds", suitEmoji: "♦️", value: 12 },
    { label: "K", suit: "diamonds", suitEmoji: "♦️", value: 13 },
    { label: "A", suit: "diamonds", suitEmoji: "♦️", value: 14 },
  ];
}

/**
 * Creates the game deck based on current game mode
 * In Phase 10 mode: Excludes Kings from the deck
 * In Poker mode: Includes all cards including Kings
 * @returns Double deck (104 cards in poker, 96 cards in Phase 10)
 */
function createGameDeck() {
  const baseDeck = createStandardDeck();
  
  if (isPhase10Mode()) {
    // Remove Kings in Phase 10 mode
    const phase10Deck = baseDeck.filter(card => card.label !== "K");
    return [...phase10Deck, ...phase10Deck]; // Double deck without Kings
  } else {
    // Keep all cards in Poker mode
    return [...baseDeck, ...baseDeck]; // Full double deck with Kings
  }
}

export default createGameDeck;
