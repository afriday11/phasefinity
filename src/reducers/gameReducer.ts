import createReducer from "../utils/createReducer";
import standardDeck from "../standardDeck";

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

const gameReducer = createReducer({
  INITIALIZE_GAME: (state: State): State => {
    return {
      ...state,
      gameStarted: true,
      allowInput: true,
      cards: standardDeck.map((card) => ({
        id: Math.floor(Math.random() * 1000000),
        label: card.label,
        value: card.value,
        suit: card.suit,
        position: "deck",
        selected: false,
      })),
    };
  },

  ADD_CARDS: (state: State, payload: Card[]): State => {
    return { ...state, cards: [...state.cards, ...payload] };
  },

  SELECT_CARD: (state: State, payload: { id: number }): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id ? { ...card, selected: true } : card
      ),
    };
  },

  TOGGLE_CARD_SELECTION: (state: State, payload: { id: number }): State => {
    console.log("TOGGLE_CARD_SELECTION", payload);
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id ? { ...card, selected: !card.selected } : card
      ),
    };
  },

  PLAY_CARDS: (state: State, payload: Card[]): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        payload.includes(card)
          ? { ...card, position: "board", selected: false }
          : card
      ),
      allowInput: false,
    };
  },

  DISCARD_CARDS: (state: State, payload: Card[]): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        payload.some((p) => p.id === card.id)
          ? { ...card, selected: false, position: "discard" }
          : card
      ),
      allowInput: false,
    };
  },

  DRAW_CARDS: (state: State, payload: number): State => {
    let cardsDrawn = 0;
    return {
      ...state,
      cards: state.cards.map((card) => {
        if (card.position === "deck" && cardsDrawn < payload) {
          cardsDrawn++;
          return { ...card, position: "hand" };
        }
        return card;
      }),
      allowInput: true,
    };
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
