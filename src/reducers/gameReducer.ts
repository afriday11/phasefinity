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
  cards: Card[];
}

const gameReducer = createReducer({
  INITIALIZE_GAME: (state: State): State => {
    return {
      ...state,
      gameStarted: true,
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

  ADD_CARD: (state: State, payload: Card): State => {
    return { ...state, cards: [...state.cards, payload] };
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
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id ? { ...card, selected: !card.selected } : card
      ),
    };
  },

  PLAY_SELECTION: (state: State, payload: Card[]): State => {
    // puts all selected cards on the board and deselects them
    return {
      ...state,
      cards: state.cards.map((card) =>
        payload.includes(card)
          ? { ...card, position: "board", selected: false }
          : card
      ),
    };
  },

  PLAY_CARD: (state: State, payload: Card): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id
          ? { ...card, position: "board", selected: false }
          : card
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
    };
  },

  DISCARD_CARD: (state: State, payload: Card): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id ? { ...card, position: "discard" } : card
      ),
    };
  },

  DISCARD_CARDS: (state: State, payload: Card[]): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        payload.includes(card) ? { ...card, position: "discard" } : card
      ),
    };
  },

  DRAW_CARD: (state: State): State => {
    // moves a card from the deck to the hand
    let found = false;
    return {
      ...state,
      cards: state.cards.map((card) => {
        if (card.position === "deck" && found === false) {
          found = true;
          return { ...card, position: "hand" };
        }
        return card;
      }),
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
