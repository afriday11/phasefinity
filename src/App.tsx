import { useEffect, useReducer, useState } from "react";
import "./App.css";
import GameControls from "./components/GameControls";
import GameBoard from "./components/GameBoard";
import gameReducer, { State } from "./reducers/gameReducer";

const initialState: State = {
  gameStarted: false,
  cards: [],
};

function App() {
  return <Test />;
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
      GameBoard
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

function useQueueState(state, setState) {
  let queue = [];
  
  return (fn)=>{
    const queueState = (state)=>queue.push(fn(state));
    fn(queueState);
  }
}


function Test() {
  const [state, setState] = useState({
    moving: false,
    position: 0,
    count: 0,
  });

  const asyncSetState = useQueueState(state, setState);

  asyncSetState((queueState)=>{
    queueState((state)=>({
      ...state,
      position: state.position + 10,
    }));
    queueState((state)=>({
      ...state,
      position: state.position + 10,
    }));
    queueState((state)=>({
      ...state,
      position: state.position + 10,
    }));
    queueState((state)=>({
      ...state,
      position: state.position + 10,
    }));
    queueState((state)=>({
      ...state,
      position: state.position + 10,
    }));
  });

  return (
    <>
    <div
      style={{
        position: "relative",
        left: state.position,
        transition: "left 0.1s ease-in-out",
      }}
    >
      Test
      </div>
      <button onClick={moveRight} disabled={state.moving}>Move Right 5 times</button>
    </>
  );
}

export default App;
