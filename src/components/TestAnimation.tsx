import { useState } from "react";
import useAnimation from "../hooks/useAnimation";

type stateType = {
  moving: boolean;
  position: number;
  position2: number;
  count: number;
};

function TestAnimation() {
  const [state, setState] = useState<stateType>({
    moving: false,
    position: 0,
    position2: 0,
    count: 0,
  });

  const animate = useAnimation<stateType>(setState);

  const animation = () => {
    animate(
      (setFrame) => {
        setFrame(
          (state) => ({
            ...state,
            position: 200,
          }),
          500
        );

        setFrame(
          (state) => ({
            ...state,
            position: 0,
          }),
          500
        );
      },
      // queueId is optional, if not provided, it will be generated automatically
      // this lets us keep appending to the same queue
      "TestAnimation"
    );
  };

  const animate2 = () => {
    animate((setFrame) => {
      setFrame((state) => ({
        ...state,
        position2: 0,
      }));

      // play a sequence of moves
      for (let i = 0; i < 5; i++) {
        setFrame(
          (state) => ({
            ...state,
            position2: state.position2 + 20,
          }),
          100
        );
      }
    }, "TestAnimation2");
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          left: state.position,
          transition: "left 0.5s ease-in-out",
        }}
      >
        Test
      </div>
      <div
        style={{
          position: "relative",
          left: state.position2,
          transition: "left 0.1s ease-in-out",
        }}
      >
        Test2
      </div>
      <button onClick={() => animation()} disabled={state.moving}>
        Move Right 10 times
      </button>
      <button onClick={() => animate2()} disabled={state.moving}>
        Move Right 10 times
      </button>
    </>
  );
}

export default TestAnimation;
