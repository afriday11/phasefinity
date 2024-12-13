import { useReducer, useEffect, useRef, Dispatch } from "react";
import "./App.css";

type boardPositions = "hand" | "board" | "discard" | "deck";

interface Card {
  id: number;
  value: string;
  suit: string;
  position: boardPositions;
  selected: boolean;
}

interface State {
  cards: Card[];
}

let initialState: State = {
  cards: [],
};

function createReducer<
  State,
  ActionType extends { type: string; payload: any }
>(handlers: Record<string, (state: State, payload: any) => State>) {
  return function reducer(state: State, action: ActionType) {
    const handler = handlers[action.type];
    if (handler) {
      return handler(state, action.payload);
    }
    return state;
  };
}

const gameReducer = createReducer({
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

function createCard(
  value: string,
  suit: string,
  position: boardPositions = "deck"
) {
  return {
    id: Math.floor(Math.random() * 1000000),
    value,
    suit,
    position,
    selected: false,
  };
}

const standardDeck = [
  { value: "A", suit: "hearts", emoji: "🂱", suitEmoji: "♥️" },
  { value: "2", suit: "hearts", emoji: "🂲", suitEmoji: "♥️" },
  { value: "3", suit: "hearts", emoji: "🂳", suitEmoji: "♥️" },
  { value: "4", suit: "hearts", emoji: "🂴", suitEmoji: "♥️" },
  { value: "5", suit: "hearts", emoji: "🂵", suitEmoji: "♥️" },
  { value: "6", suit: "hearts", emoji: "🂶", suitEmoji: "♥️" },
  { value: "7", suit: "hearts", emoji: "🂷", suitEmoji: "♥️" },
  { value: "8", suit: "hearts", emoji: "🂸", suitEmoji: "♥️" },
  { value: "9", suit: "hearts", emoji: "🂹", suitEmoji: "♥️" },
  { value: "10", suit: "hearts", emoji: "🂺", suitEmoji: "♥️" },
  { value: "J", suit: "hearts", emoji: "🂻", suitEmoji: "♥️" },
  { value: "Q", suit: "hearts", emoji: "🂽", suitEmoji: "♥️" },
  { value: "K", suit: "hearts", emoji: "🂾", suitEmoji: "♥️" },
  { value: "A", suit: "spades", emoji: "🃁", suitEmoji: "♠️" },
  { value: "2", suit: "spades", emoji: "🃂", suitEmoji: "♠️" },
  { value: "3", suit: "spades", emoji: "🃃", suitEmoji: "♠️" },
  { value: "4", suit: "spades", emoji: "🃄", suitEmoji: "♠️" },
  { value: "5", suit: "spades", emoji: "🃅", suitEmoji: "♠️" },
  { value: "6", suit: "spades", emoji: "🃆", suitEmoji: "♠️" },
  { value: "7", suit: "spades", emoji: "🃇", suitEmoji: "♠️" },
  { value: "8", suit: "spades", emoji: "🃈", suitEmoji: "♠️" },
  { value: "9", suit: "spades", emoji: "🃉", suitEmoji: "♠️" },
  { value: "10", suit: "spades", emoji: "🃊", suitEmoji: "♠️" },
  { value: "J", suit: "spades", emoji: "🃋", suitEmoji: "♠️" },
  { value: "Q", suit: "spades", emoji: "🃌", suitEmoji: "♠️" },
  { value: "K", suit: "spades", emoji: "🃍", suitEmoji: "♠️" },
  { value: "A", suit: "clubs", emoji: "🃑", suitEmoji: "♣️" },
  { value: "2", suit: "clubs", emoji: "🃒", suitEmoji: "♣️" },
  { value: "3", suit: "clubs", emoji: "🃓", suitEmoji: "♣️" },
  { value: "4", suit: "clubs", emoji: "🃔", suitEmoji: "♣️" },
  { value: "5", suit: "clubs", emoji: "🃕", suitEmoji: "♣️" },
  { value: "6", suit: "clubs", emoji: "🃖", suitEmoji: "♣️" },
  { value: "7", suit: "clubs", emoji: "🃗", suitEmoji: "♣️" },
  { value: "8", suit: "clubs", emoji: "🃘", suitEmoji: "♣️" },
  { value: "9", suit: "clubs", emoji: "🃙", suitEmoji: "♣️" },
  { value: "10", suit: "clubs", emoji: "🃚", suitEmoji: "♣️" },
  { value: "J", suit: "clubs", emoji: "🃛", suitEmoji: "♣️" },
  { value: "Q", suit: "clubs", emoji: "🃝", suitEmoji: "♣️" },
  { value: "K", suit: "clubs", emoji: "🃞", suitEmoji: "♣️" },
  { value: "A", suit: "diamonds", emoji: "🃁", suitEmoji: "♦️" },
  { value: "2", suit: "diamonds", emoji: "🃂", suitEmoji: "♦️" },
  { value: "3", suit: "diamonds", emoji: "🃃", suitEmoji: "♦️" },
  { value: "4", suit: "diamonds", emoji: "🃄", suitEmoji: "♦️" },
  { value: "5", suit: "diamonds", emoji: "🃅", suitEmoji: "♦️" },
  { value: "6", suit: "diamonds", emoji: "🃆", suitEmoji: "♦️" },
  { value: "7", suit: "diamonds", emoji: "🃇", suitEmoji: "♦️" },
  { value: "8", suit: "diamonds", emoji: "🃈", suitEmoji: "♦️" },
  { value: "9", suit: "diamonds", emoji: "🃉", suitEmoji: "♦️" },
  { value: "10", suit: "diamonds", emoji: "🃊", suitEmoji: "♦️" },
  { value: "J", suit: "diamonds", emoji: "🃋", suitEmoji: "♦️" },
  { value: "Q", suit: "diamonds", emoji: "🃍", suitEmoji: "♦️" },
  { value: "K", suit: "diamonds", emoji: "🃎", suitEmoji: "♦️" },
];

initialState = gameReducer(initialState, {
  type: "ADD_CARDS",
  payload: standardDeck.map((card) =>
    createCard(card.value, card.suit, "deck")
  ),
});

initialState = gameReducer(initialState, {
  type: "SHUFFLE_DECK",
  payload: null,
});

type cardProps = {
  card: Card;
  zIndex: number;
  position: { x: number; y: number };
  rotation: number;
  onClick: () => void;
};

function Card({ card, zIndex, position, rotation, ...props }: cardProps) {
  return (
    <div
      key={card.id}
      className="card"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        zIndex: zIndex,
      }}
      {...props}
    >
      <span className="card-value">
        <span>{card.value}</span>
        <span>
          {
            {
              hearts: "♥️",
              diamonds: "♦️",
              clubs: "♣️",
              spades: "♠️",
            }[card.suit]
          }
        </span>
      </span>
    </div>
  );
}

function drawCards(cards: number, dispatch: Dispatch<any>): Promise<void> {
  return new Promise((resolve) => {
    for (let i = 0; i < cards; i++) {
      setTimeout(() => {
        dispatch({
          type: "DRAW_CARD",
          payload: null,
        });

        // Resolve the promise after the last card is drawn
        if (i === cards - 1) {
          resolve();
        }
      }, i * 100);
    }
    // If no cards to draw, resolve immediately
    if (cards === 0) {
      resolve();
    }
  });
}

function discardCards(cards: Card[], dispatch: Dispatch<any>): Promise<void> {
  return new Promise((resolve) => {
    let totalDiscarded = 0;
    for (let i = 0; i < cards.length; i++) {
      setTimeout(() => {
        dispatch({
          type: "DISCARD_CARD",
          payload: cards[cards.length - 1 - i],
        });
        totalDiscarded++;

        // Move the resolution check inside the timeout callback
        if (totalDiscarded === cards.length) {
          resolve();
        }
      }, i * 100);
    }

    // If no cards to discard, resolve immediately
    if (cards.length === 0) {
      resolve();
    }
  });
}

function playCards(cards: Card[], dispatch: Dispatch<any>): Promise<void> {
  return new Promise((resolve) => {
    for (let i = 0; i < cards.length; i++) {
      setTimeout(() => {
        dispatch({
          type: "PLAY_CARD",
          payload: cards[i],
        });
        // Resolve the promise after the last card is played
        if (i === cards.length - 1) {
          resolve();
        }
      }, i * 100);
    }

    // If no cards to play, resolve immediately
    if (cards.length === 0) {
      resolve();
    }
  });
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          dispatch({
            type: "DRAW_CARD",
            payload: null,
          });
        }, i * 100);
      }
    }
  }, []);

  const deckCards = state.cards.filter((card) => card.position === "deck");
  const handCards = state.cards.filter((card) => card.position === "hand");
  const boardCards = state.cards.filter((card) => card.position === "board");
  const discardPile = state.cards.filter((card) => card.position === "discard");
  const selectedCards = state.cards.filter((card) => card.selected);

  const cards = [
    ...renderHand(handCards, 600, true),
    ...renderHand(boardCards, 300, true),
    ...renderHand(discardPile, -200),
    ...renderHand(deckCards, 900),
  ];

  //sort by key
  cards.sort((a: any, b: any) => a.key - b.key);

  return (
    <div>
      {cards}

      {/* play hand button */}
      <div className="button-container">
        <button
          onClick={() => {
            const selectedCards = handCards.filter((card) => card.selected);
            playCards(selectedCards, dispatch).then(() => {
              // now draw however many cards you played

              setTimeout(() => {
                discardCards(selectedCards, dispatch).then(() => {
                  drawCards(selectedCards.length, dispatch);
                });
              }, 500);
            });
          }}
          disabled={selectedCards.length === 0}
        >
          Play Hand
        </button>

        {/* discard button */}
        <button
          onClick={() => {
            const selectedCards = handCards.filter((card) => card.selected);
            // now discard however many cards you played
            discardCards(selectedCards, dispatch).then(() => {
              // now draw however many cards you discarded
              drawCards(selectedCards.length, dispatch);
            });
          }}
          disabled={selectedCards.length === 0}
        >
          Discard
        </button>

        {/* reset button */}
        <button
          onClick={() => {
            dispatch({ type: "RESET", payload: null });
            dispatch({ type: "SHUFFLE_DECK", payload: null });
            drawCards(5, dispatch);
          }}
          disabled={deckCards.length !== 0}
        >
          Reset
        </button>
      </div>
    </div>
  );

  function renderHand(cards: Card[], top: number, splayed: boolean = false) {
    const cardWidth = 100;
    const screenWidth = window.innerWidth;
    const screenHalf = screenWidth / 2;
    const cardSpacing = Math.min((screenWidth * 0.666) / cards.length, 100);
    const cardOffset = cardSpacing * (cards.length / 2);

    return cards.map((card, index) => {
      const cardPosition = splayed
        ? index * cardSpacing + cardSpacing / 2 - cardOffset
        : 0;

      // calc a card rotation based on its position from center
      const cardRotation = splayed ? cardPosition / (screenWidth / 50) : 0;

      // calc a parabolic y offset based on its position from center
      const yOffset = cardPosition * (cardPosition / (screenWidth * 2));

      const x = cardPosition + screenHalf - cardWidth / 2;
      const y = top - (card.selected ? 40 : 0) + yOffset;
      return (
        <Card
          key={card.id}
          card={card}
          zIndex={index}
          position={{ x, y }}
          rotation={cardRotation}
          onClick={() =>
            dispatch({
              type: "TOGGLE_CARD_SELECTION",
              payload: { id: card.id },
            })
          }
        />
      );
    });
  }
}

export default App;
