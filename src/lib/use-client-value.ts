"use client";

import { useRef, useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

/**
 * Reads a client-only computed value (e.g. from localStorage) without a
 * hydration mismatch and without the "setState in an effect" anti-pattern.
 * Server (and the client's first hydration pass) get `serverValue`; once
 * hydrated, `compute()` runs exactly once per mount and its result is cached
 * so repeated snapshot reads return a stable reference, as useSyncExternalStore
 * requires. There's no live subscription — a fresh page load is what refreshes
 * the data, matching how the rest of this app's activity log is consumed.
 */
export function useClientValue<T>(compute: () => T, serverValue: T): T {
  const cache = useRef<{ value: T } | null>(null);
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      if (cache.current === null) {
        cache.current = { value: compute() };
      }
      return cache.current.value;
    },
    () => serverValue,
  );
}
