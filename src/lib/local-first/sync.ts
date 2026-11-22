"use client";
import { useEffect, useSyncExternalStore } from "react";
import { db } from "./client-db";
import { isOffline, lfFetch, subscribeNetwork } from "./network";
import type { LfTodo } from "./server-store";

/**
 * Background sync: push the outbox (dirty rows), pull what changed on the server.
 * Conflict rule: last-write-wins by `updatedAt`. Simple, but it can drop a
 * concurrent edit — real apps use CRDTs (Yjs, Automerge) or a sync engine.
 */
export async function syncOnce() {
  const outbox = await db.todos.where("dirty").equals(1).toArray();
  const since = (await db.meta.get("version"))?.value ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changes = outbox.map(({ dirty, ...todo }) => todo);
  const res: { version: number; changes: LfTodo[] } = await lfFetch("/api/local-first/sync", {
    method: "POST",
    body: JSON.stringify({ changes, since }),
  });

  await db.transaction("rw", db.todos, db.meta, async () => {
    // Pushed rows are clean now — unless they were edited again while we were syncing.
    for (const sent of outbox) {
      const current = await db.todos.get(sent.id);
      if (current?.updatedAt === sent.updatedAt) await db.todos.update(sent.id, { dirty: 0 });
    }
    // Apply remote changes unless we have a newer local edit.
    for (const remote of res.changes) {
      const local = await db.todos.get(remote.id);
      if (!local || remote.updatedAt >= local.updatedAt) await db.todos.put({ ...remote, dirty: 0 });
    }
    await db.meta.put({ key: "version", value: res.version });
  });
}

// --- A tiny status store + loop so the UI can show "syncing / offline / error" ---
type Status = { state: "idle" | "syncing" | "offline" | "error"; lastSyncedAt: number | null; error?: string };
let status: Status = { state: "idle", lastSyncedAt: null };
const listeners = new Set<() => void>();
const setStatus = (next: Partial<Status>) => {
  status = { ...status, ...next };
  listeners.forEach((l) => l());
};
let running: Promise<void> | null = null;
let again = false; // a change arrived mid-sync: run once more when done

export function requestSync() {
  if (isOffline()) return setStatus({ state: "offline" });
  if (running) return void (again = true);
  running = (async () => {
    setStatus({ state: "syncing" });
    try {
      await syncOnce();
      setStatus({ state: "idle", lastSyncedAt: Date.now(), error: undefined });
    } catch (e) {
      setStatus({ state: isOffline() ? "offline" : "error", error: (e as Error).message });
    } finally {
      running = null;
      if (again) {
        again = false;
        requestSync();
      }
    }
  })();
}

/** Sync on mount, every 3s, and as soon as we come back online. */
export function useSyncLoop() {
  useEffect(() => {
    requestSync();
    const interval = setInterval(requestSync, 3000);
    const unsubscribe = subscribeNetwork(requestSync);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);
  return useSyncExternalStore(
    (cb) => (listeners.add(cb), () => void listeners.delete(cb)),
    () => status,
    () => status,
  );
}
