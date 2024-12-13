import { useReducer } from "react";
import "./App.css";
import GameControls from "./components/GameControls";
import GameBoard from "./components/GameBoard";
import ScoreDisplay from "./components/ScoreDisplay";
import gameReducer, { State } from "./reducers/gameReducer";
import scoreReducer, { initialScoreState } from "./reducers/scoreReducer";

const initialState: State = {
  gameStarted: false,
  cards: [],
};

function App() {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialState);
  const [scoreState, scoreDispatch] = useReducer(scoreReducer, initialScoreState);

  // the cards are in a single array so that React can animate them
  // so we need to filter them out into separate arrays for each position
  const deckCards = gameState.cards.filter((card) => card.position === "deck");
  const handCards = gameState.cards.filter((card) => card.position === "hand");
  const boardCards = gameState.cards.filter((card) => card.position === "board");
  const discardPile = gameState.cards.filter((card) => card.position === "discard");
  const selectedCards = gameState.cards.filter((card) => card.selected);

  return (
    <div>
      {gameState.gameStarted && <ScoreDisplay score={scoreState} />}
      <GameBoard
        handCards={handCards}
        boardCards={boardCards}
        discardPile={discardPile}
        deckCards={deckCards}
        dispatch={gameDispatch}
      />
      <GameControls
        gameStarted={gameState.gameStarted}
        handCards={handCards}
        selectedCards={selectedCards}
        deckCards={deckCards}
        dispatch={gameDispatch}
        scoreDispatch={scoreDispatch}
      />
    </div>
  );
}

export default App;
