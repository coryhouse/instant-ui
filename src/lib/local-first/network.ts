"use client";
import { useSyncExternalStore } from "react";

/**
 * In-page "Simulate offline" switch. The dev server is on localhost, so real
 * offline mode wouldn't block it; instead every local-first fetch goes through
 * `lfFetch`, which fails like a dropped connection while this is on.
 */
let offline = false;
const listeners = new Set<() => void>();

export function setOffline(next: boolean) {
  offline = next;
  listeners.forEach((l) => l());
}
export const isOffline = () => offline;
export function subscribeNetwork(cb: () => void) {
  listeners.add(cb);
  return () => void listeners.delete(cb);
}
export function useOffline() {
  return useSyncExternalStore(subscribeNetwork, isOffline, () => false);
}

export async function lfFetch(url: string, init?: RequestInit) {
  if (offline) throw new TypeError("Failed to fetch (you are offline)");
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
  if (offline) throw new TypeError("Failed to fetch (connection lost)");
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}
