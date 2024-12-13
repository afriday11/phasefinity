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

  MOVE_CARD_TO_RANDOM_POSITION: (
    state: State,
    payload: { id: number }
  ): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id
          ? {
              ...card,
              position: Math.random() < 0.5 ? "hand" : "board",
            }
          : card
      ),
    };
  },

  SWAP_CARD_POSITION: (state: State, payload: { id: number }): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id
          ? {
              ...card,
              position: card.position === "hand" ? "board" : "hand",
            }
          : card
      ),
    };
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

  DISCARD_CARD: (state: State, payload: Card): State => {
    return {
      ...state,
      cards: state.cards.map((card) =>
        card.id === payload.id ? { ...card, position: "discard" } : card
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

  SHUFFLE_DECK: (state: State): State => {
    return {
      ...state,
      cards: state.cards.sort(() => Math.random() - 0.5),
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
});

export default gameReducer;
