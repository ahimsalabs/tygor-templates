import { useState, useEffect } from "react";
import type { LiveValue, SubscriptionResult } from "@tygor/client";

/**
 * React hook for subscribing to a tygor LiveValue or Stream.
 * Returns the current SubscriptionResult which includes data, status, and connection state.
 *
 * The liveValue reference should remain stable across renders. Use useMemo if needed:
 *
 * @example
 * // Stable reference - works fine
 * const result = useLiveValue(client.Message.State);
 *
 * // Factory call - stabilize with useMemo
 * const stream = useMemo(() => client.Time.Now(), []);
 * const result = useLiveValue(stream);
 */
export function useLiveValue<T>(liveValue: LiveValue<T>): SubscriptionResult<T> {
  const [state, setState] = useState<SubscriptionResult<T>>(() => liveValue.getSnapshot());

  useEffect(() => {
    const unsubscribe = liveValue.subscribe(setState);
    return unsubscribe;
  }, [liveValue]);

  return state;
}

// Alias for backwards compatibility
export const useAtom = useLiveValue;
