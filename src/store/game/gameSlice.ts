import createReducer from "../../utils/createReducer";
import standardDeck from "../../standardDeck";
import { GameAction } from "../../types/actions";
import { Joker } from "../../types/jokerTypes";

export type boardPositions = "hand" | "board" | "discard" | "deck";

export interface Card {
  id: number;
  label: string;
  value: number;
  suit: string;
  position: boardPositions;
  selected: boolean;
}

export interface State {
  gameStarted: boolean;
  allowInput: boolean;
  cards: Card[];
  jokers: Joker[];  // Player's equipped jokers (max 5)
}

const gameReducer = createReducer<State, GameAction>({
  INITIALIZE_GAME: (state: State): State => {
    console.log("🎯 INITIALIZE_GAME action processing...");
    const newState = {
      ...state,
      gameStarted: true,
      allowInput: true,
      jokers: [],  // Start with no jokers equipped
      cards: standardDeck.map((card) => ({
        id: Math.floor(Math.random() * 1000000),
        label: card.label,
        value: card.value,
        suit: card.suit,
        position: "deck" as boardPositions,
        selected: false,
      })),
    };
    console.log("🎯 INITIALIZE_GAME complete:", { 
      gameStarted: newState.gameStarted, 
      cardCount: newState.cards.length 
    });
    return newState;
  },

  ADD_CARDS: (state: State, action): State => {
    return { ...state, cards: [...state.cards, ...action.payload] };
  },

  SELECT_CARD: (state: State, action): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === action.payload.id ? { ...card, selected: true } : card
      ),
    };
  },

  TOGGLE_CARD_SELECTION: (state: State, action): State => {
    console.log("TOGGLE_CARD_SELECTION", action.payload);
    
    // Find the card being clicked
    const targetCard = state.cards.find(card => card.id === action.payload.id);
    if (!targetCard) return state;
    
    // If card is currently selected, always allow deselection
    if (targetCard.selected) {
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? { ...card, selected: false } : card
        ),
      };
    }
    
    // If card is not selected, check if we're at the 5-card limit
    const selectedCards = state.cards.filter(card => card.selected && card.position === "hand");
    if (selectedCards.length >= 5) {
      console.log("🚫 Cannot select more than 5 cards");
      return state; // Don't allow selection if already at limit
    }
    
    // Allow selection if under the limit
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === action.payload.id ? { ...card, selected: true } : card
      ),
    };
  },

  PLAY_CARDS: (state: State, action): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        action.payload.includes(card)
          ? { ...card, position: "board", selected: false }
          : card
      ),
      allowInput: false,
    };
  },

  DISCARD_CARDS: (state: State, action): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        action.payload.some((p) => p.id === card.id)
          ? { ...card, selected: false, position: "discard" }
          : card
      ),
      allowInput: false,
    };
  },

  DRAW_CARDS: (state: State, action): State => {
    console.log(`🎯 DRAW_CARDS action: drawing ${action.payload} cards`);
    let cardsDrawn = 0;
    const newState = {
      ...state,
      cards: state.cards.map((card) => {
        if (card.position === "deck" && cardsDrawn < action.payload) {
          cardsDrawn++;
          return { ...card, position: "hand" as boardPositions };
        }
        return card;
      }),
      allowInput: true,
    };
    console.log(`🎯 DRAW_CARDS complete: drew ${cardsDrawn} cards to hand`);
    return newState;
  },

  SHUFFLE_DECK: (state: State): State => {
    const cards = [...state.cards];
    // Fisher-Yates shuffle algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]; // swap elements
    }
    return {
      ...state,
      cards,
    };
  },

  RESET: (state: State): State => {
    // moves all cards to the deck
    return {
      ...state,
      cards: state.cards.map((card) => ({
        ...card,
        position: "deck",
        selected: false,
      })),
    };
  },

  SORT_HAND: (state: State): State => {
    const handCards = state.cards.filter((card) => card.position === "hand");
    const otherCards = state.cards.filter((card) => card.position !== "hand");
    handCards.sort((a, b) => b.value - a.value);
    handCards.sort((a, b) => a.suit.localeCompare(b.suit));
    return {
      ...state,
      cards: [...handCards, ...otherCards],
    };
  },

  // Joker management actions
  EQUIP_JOKER: (state: State, action): State => {
    // Only allow up to 5 jokers
    if (state.jokers.length >= 5) {
      console.warn("Cannot equip joker - maximum of 5 jokers allowed");
      return state;
    }
    return {
      ...state,
      jokers: [...state.jokers, action.payload.joker],
    };
  },

  UNEQUIP_JOKER: (state: State, action): State => {
    return {
      ...state,
      jokers: state.jokers.filter(joker => joker.id !== action.payload.jokerId),
    };
  },

  CLEAR_EQUIPPED_JOKERS: (state: State): State => {
    return {
      ...state,
      jokers: [],
    };
  },
});

export default gameReducer;
