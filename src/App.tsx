import { useReducer } from "react";
import "./App.css";
import GameControls from "./components/GameControls";
import GameBoard from "./components/GameBoard";
import gameReducer, { State } from "./reducers/gameReducer";

const initialState: State = {
  gameStarted: false,
  cards: [],
};

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

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
        gameStarted={state.gameStarted}
        handCards={handCards}
        selectedCards={selectedCards}
        deckCards={deckCards}
        dispatch={dispatch}
      />
    </div>
  );
}

export default App;
