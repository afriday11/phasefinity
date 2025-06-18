import createReducer from "../../utils/createReducer";
import standardDeck from "../../standardDeck";
import { GameAction } from "../../types/actions";

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
}

const gameReducer = createReducer<State, GameAction>({
  INITIALIZE_GAME: (state: State): State => {
    console.log("🎯 INITIALIZE_GAME action processing...");
    const newState = {
      ...state,
      gameStarted: true,
      allowInput: true,
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
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === action.payload.id ? { ...card, selected: !card.selected } : card
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
});

export default gameReducer;
