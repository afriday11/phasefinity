import { useEffect, useRef } from "react";

function useMount(fn: () => void, deps?: any[]) {
  const mountedRef = useRef(true);
  useEffect(() => {
    if (mountedRef.current) {
      mountedRef.current = false;
      fn();
    }
  }, deps);
}

export default useMount;
