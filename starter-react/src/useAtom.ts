import { useState, useEffect } from "react";
import type { Atom, SubscriptionResult } from "@tygor/client";

/**
 * React hook for subscribing to a tygor Atom or Stream.
 * Returns the current SubscriptionResult which includes data, status, and connection state.
 *
 * @example
 * const result = useAtom(client.Message.State);
 * if (result.data) {
 *   return <div>{result.data.message}</div>;
 * }
 */
export function useAtom<T>(atom: Atom<T>): SubscriptionResult<T> {
  const [state, setState] = useState<SubscriptionResult<T>>(atom.getSnapshot());

  useEffect(() => {
    return atom.subscribe(setState);
  }, [atom]);

  return state;
}
