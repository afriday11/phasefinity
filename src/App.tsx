import { useReducer } from "react";
import "./App.css";
import GameControls from "./components/GameControls";
import GameBoard from "./components/GameBoard";
import ScoreDisplay from "./components/ScoreDisplay";
import gameReducer, { State } from "./reducers/gameReducer";
import scoreReducer, { initialScoreState } from "./reducers/scoreReducer";
import { evaluateHand } from "./services/scoreService";
import useDealer from "./hooks/useDealer";

const initialState: State = {
  gameStarted: false,
  cards: [],
};

function App() {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialState);
  const [scoreState, scoreDispatch] = useReducer(
    scoreReducer,
    initialScoreState
  );
  const { cards, isDealing } = useDealer(gameState.cards);

  // the cards are in a single array so that React can animate them
  // so we need to filter them out into separate arrays for each position
  function getCardState() {
    const deckCards = cards.filter((card) => card.position === "deck");
    const handCards = cards.filter((card) => card.position === "hand");
    const boardCards = cards.filter((card) => card.position === "board");
    const discardPile = cards.filter((card) => card.position === "discard");
    const selectedCards = handCards.filter((card) => card.selected);

    return { deckCards, handCards, boardCards, discardPile, selectedCards };
  }

  const cardState = getCardState();

  const handEvaluation =
    selectedCards.length > 0 && evaluateHand(selectedCards);

  function renderHandEvaluation() {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 300,
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p>{handEvaluation.handType}</p>
        <p>+{handEvaluation.score}</p>
      </div>
    );
  }

  return (
    <div>
      {gameState.gameStarted && <ScoreDisplay score={scoreState} />}
      {handEvaluation && renderHandEvaluation()}
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {isDealing ? "dealing" : "not dealing"}
      </div>
      <GameBoard cardState={cardState} dispatch={gameDispatch} />
      <GameControls
        gameStarted={gameState.gameStarted}
        cardState={cardState}
        dispatch={gameDispatch}
        scoreDispatch={scoreDispatch}
      />
    </div>
  );
}

export default App;
