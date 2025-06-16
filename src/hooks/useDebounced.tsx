import { useCallback, useRef } from 'react';

type AwaitedOrPromise<T> = Awaited<T> | Promise<Awaited<T>>;

export function useDebounced<T extends (...args: Parameters<T>) => AwaitedOrPromise<ReturnType<T>>>(
  f: T,
  delay: number,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      return new Promise((resolve) => {
        timer.current = setTimeout(() => resolve(f(...args)), delay);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay],
  );
}
