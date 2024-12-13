import { useReducer } from "react";
import "./App.css";
import useMount from "./utils/useMount";
import GameControls from "./components/GameControls";
import GameBoard from "./components/GameBoard";
import gameReducer, { State } from "./reducers/gameReducer";

const initialState: State = {
  cards: [],
};

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useMount(() => {
    for (let i = 0; i < 5; i++) {
      dispatch({
        type: "INITIALIZE_GAME",
        payload: null,
      });
      dispatch({
        type: "SHUFFLE_DECK",
        payload: null,
      });
      setTimeout(() => {
        dispatch({
          type: "DRAW_CARD",
          payload: null,
        });
      }, i * 100);
    }
  });

  // the cards are in a single array so that React can animate them
  // so we need to filter them out into separate arrays for each position
  const deckCards = state.cards.filter((card) => card.position === "deck");
  const handCards = state.cards.filter((card) => card.position === "hand");
  const boardCards = state.cards.filter((card) => card.position === "board");
  const discardPile = state.cards.filter((card) => card.position === "discard");
  const selectedCards = state.cards.filter((card) => card.selected);

  return (
    <div>
      <GameBoard
        handCards={handCards}
        boardCards={boardCards}
        discardPile={discardPile}
        deckCards={deckCards}
        dispatch={dispatch}
      />
      <GameControls
        handCards={handCards}
        selectedCards={selectedCards}
        deckCards={deckCards}
        dispatch={dispatch}
      />
    </div>
  );
}

export default App;
