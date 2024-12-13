import { useEffect, useState, useCallback } from "react";

type StateUpdater<T> = (state: T) => T;
type QueueStateFn<T> = (updater: StateUpdater<T>, delay?: number) => void;
type QueueFunction<T> = (queueState: QueueStateFn<T>) => void;

// Add this at the top level of the file, outside any components
const globalQueue = {
  queue: [] as (() => Promise<void>)[],
  processing: false,
};

function useAnimation<T>(setState: (updater: StateUpdater<T>) => void) {
  // Keep a local state to trigger effects
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    console.log("queue", globalQueue.queue, globalQueue.queue.length);
    if (globalQueue.queue.length > 0) {
      const fn = globalQueue.queue.shift()!;
      fn().then(() => {
        // Update local state to trigger next processing
        setQueueLength(globalQueue.queue.length);
      });
    }
  }, [queueLength]);

  return useCallback(
    (callback: QueueFunction<T>) => {
      const tempQueue: (() => Promise<void>)[] = [];

      const queueState = (fn: StateUpdater<T>, delay = 0) => {
        const promiseFn = () =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setState(fn);
              resolve();
            }, delay);
          });
        tempQueue.push(promiseFn);
        return promiseFn;
      };

      callback(queueState);
      globalQueue.queue.push(...tempQueue);
      // Update local state to trigger processing
      setQueueLength(globalQueue.queue.length);
    },
    [setState]
  );
}

export default useAnimation;
