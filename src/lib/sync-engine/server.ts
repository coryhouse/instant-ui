import "server-only";
import { maybeFail } from "../server-settings";
import { applyMutation, type PendingMutation, type Poke, type Todo } from "./shared";

/**
 * The authoritative server. Lives on globalThis so it survives HMR and is shared
 * by every route. Each processed mutation bumps `version`; then every connected
 * client gets a poke (via SSE) with the new state.
 */
type ServerState = {
  version: number;
  todos: Todo[];
  lastSeq: Record<string, number>;
  listeners: Set<(poke: Poke) => void>;
};
const g = globalThis as typeof globalThis & { __instantUiSyncEngine?: ServerState };
const state = (g.__instantUiSyncEngine ??= {
  version: 1,
  todos: [
    { id: "s1", text: "Open this page in two windows", done: false },
    { id: "s2", text: "Toggle me in one, watch the other", done: false },
  ],
  lastSeq: {},
  listeners: new Set(),
});

export function snapshot(applied: Poke["applied"] = []): Poke {
  return { version: state.version, todos: state.todos, lastSeq: state.lastSeq, applied };
}

export function push(mutations: PendingMutation[]) {
  const applied: Poke["applied"] = [];
  for (const m of mutations) {
    if (m.seq <= (state.lastSeq[m.clientId] ?? 0)) continue; // already processed: retries are safe
    let ok = true;
    try {
      maybeFail(); // "Fail 50% of writes" → server rejects; the client will drop it (rollback)
      state.todos = applyMutation(state.todos, m);
    } catch {
      ok = false;
    }
    state.lastSeq[m.clientId] = m.seq;
    state.version++;
    applied.push({ clientId: m.clientId, seq: m.seq, name: m.name, ok });
  }
  if (applied.length) {
    const poke = snapshot(applied);
    state.listeners.forEach((send) => send(poke));
  }
  return applied;
}

export function subscribe(send: (poke: Poke) => void) {
  state.listeners.add(send);
  return () => void state.listeners.delete(send);
}

export const connectedClients = () => state.listeners.size;
