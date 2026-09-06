import { useEffect, useState } from 'react';

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * 마운트 시 한 번 부르고 언마운트에 취소하는 최소 훅.
 * deps 가 바뀌면 다시 부른다. (라이브러리를 하나도 안 쓰기 위한 최소 구현)
 */
export function useAsync<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(ctrl.signal)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (!alive || ctrl.signal.aborted) return;
        setState({ data: null, loading: false, error: err as Error });
      });
    return () => {
      alive = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
