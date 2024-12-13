import { useState } from "react";
import useAnimation from "../hooks/useAnimation";

type stateType = {
  moving: boolean;
  position: number;
  count: number;
};

function TestAnimation() {
  const [state, setState] = useState<stateType>({
    moving: false,
    position: 0,
    count: 0,
  });

  const animate = useAnimation<stateType>(setState);
  const animation = () =>
    animate((setState) => {
      // initialize the start position and set moving to true
      // to prevent user input while the animation is running
      setState((state) => ({
        ...state,
        position: 0,
        moving: true,
      }));

      // play a sequence of moves
      for (let i = 0; i < 5; i++) {
        setState(
          (state) => ({
            ...state,
            position: state.position + 20,
          }),
          100
        );
      }

      // set moving to false to allow user input again
      setState((state) => ({
        ...state,
        moving: false,
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
      <button onClick={() => animation()} disabled={state.moving}>
        Move Right 10 times
      </button>
    </>
  );
}

export default TestAnimation;
