import { createSignal, onMount, onCleanup } from "solid-js";
import type { LiveValue, SubscriptionResult } from "@tygor/client";

/**
 * Solid.js hook for subscribing to a tygor LiveValue or Stream.
 * Returns an accessor that provides the current SubscriptionResult.
 *
 * @example
 * const result = useLiveValue(client.Message.State);
 * // In JSX:
 * <Show when={result().data}>
 *   {(data) => <div>{data().message}</div>}
 * </Show>
 */
export function useLiveValue<T>(liveValue: LiveValue<T>) {
  const [state, setState] = createSignal<SubscriptionResult<T>>(liveValue.getSnapshot());

  onMount(() => {
    const unsub = liveValue.subscribe(setState);
    onCleanup(unsub);
  });

  return state;
}

// Alias for backwards compatibility
export const useAtom = useLiveValue;
