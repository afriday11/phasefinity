import { useEffect, useRef } from "react";

function useMount(fn: () => void) {
  const mountedRef = useRef(true);
  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      fn();
    }
  }, []);
}

export default useMount;
