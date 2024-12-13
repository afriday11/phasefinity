import { useEffect, useState, useCallback } from "react";

type StateUpdater<T> = (state: T) => T;
type QueueStateFn<T> = (updater: StateUpdater<T>, delay?: number) => void;
type QueueFunction<T> = (queueState: QueueStateFn<T>, queueId?: string) => void;

type NamedQueue = {
  queue: (() => Promise<void>)[];
  processing: boolean;
};

const namedQueueMap = new Map<string, NamedQueue>();
let queueCounter = 0;

function useAnimation<T>(setState: (updater: StateUpdater<T>) => void) {
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    namedQueueMap.forEach((namedQueue, queueId) => {
      if (namedQueue.queue.length > 0 && !namedQueue.processing) {
        namedQueue.processing = true;
        const fn = namedQueue.queue.shift()!;
        fn().then(() => {
          namedQueue.processing = false;
          setQueueLength((prev) => prev - 1);

          // Only clean up automatically generated queues
          if (namedQueue.queue.length === 0 && queueId.startsWith("queue_")) {
            namedQueueMap.delete(queueId);
          }
        });
      }
    });
  }, [queueLength]);

  return useCallback(
    (callback: QueueFunction<T>, queueId?: string) => {
      queueId = queueId ?? `queue_${queueCounter++}`;

      callback((fn: StateUpdater<T>, delay = 0) => {
        const promiseFn = () =>
          new Promise<void>((resolve) => {
            setState(fn);
            setTimeout(() => {
              resolve();
            }, delay);
          });

        const targetQueueId = queueId ?? `queue_${queueCounter++}`;
        if (!namedQueueMap.has(targetQueueId)) {
          namedQueueMap.set(targetQueueId, {
            queue: [],
            processing: false,
          });
        }
        const targetQueue = namedQueueMap.get(targetQueueId)!;
        targetQueue.queue.push(promiseFn);
        setQueueLength((prev) => prev + 1);
        return promiseFn;
      }, queueId);
    },
    [setState]
  );
}

export default useAnimation;
