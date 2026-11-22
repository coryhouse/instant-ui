"use client";
import { applyMutation, type Mutation, type PendingMutation, type Poke, type Todo } from "./shared";

/**
 * The client half (Replicache-style):
 *   view = confirmed server state + my pending mutations replayed on top.
 * mutate() updates the view instantly; the server's poke later "rebases" it.
 */
export type LogEntry = { id: number; kind: "local" | "push" | "confirm" | "remote" | "reject" | "info"; text: string };
export type ClientState = {
  clientId: string;
  todos: Todo[];
  version: number;
  pending: PendingMutation[];
  connected: boolean;
  log: LogEntry[];
};
export const EMPTY_STATE: ClientState = { clientId: "", todos: [], version: 0, pending: [], connected: false, log: [] };

export class SyncClient {
  readonly clientId = crypto.randomUUID().slice(0, 6);
  private confirmed: Todo[] = [];
  private version = 0;
  private pending: PendingMutation[] = [];
  private seq = 0;
  private source: EventSource | null = null;
  private log: LogEntry[] = [];
  private listeners = new Set<() => void>();
  state: ClientState = EMPTY_STATE;

  connect() {
    if (this.source) return;
    this.source = new EventSource("/api/sync/hand-rolled/events");
    this.source.onmessage = (e) => this.onPoke(JSON.parse(e.data));
    this.source.onopen = () => {
      this.addLog("info", "connected (SSE)");
      void this.flush(); // push anything queued while disconnected
    };
    this.source.onerror = () => this.addLog("info", "disconnected, retrying…"); // EventSource auto-reconnects
  }

  disconnect() {
    this.source?.close();
    this.source = null;
  }

  /** 1) apply locally (instant)  2) queue  3) push in the background. */
  mutate(m: Mutation) {
    const pm: PendingMutation = { ...m, clientId: this.clientId, seq: ++this.seq };
    this.pending.push(pm);
    this.addLog("local", `#${pm.seq} ${m.name} applied locally`);
    void this.flush();
  }

  private async flush() {
    if (this.pending.length === 0) return;
    const batch = this.pending; // send ALL pending; the server skips ones it already has
    this.addLog("push", `→ push ${batch.map((m) => `#${m.seq}`).join(", ")}`);
    try {
      await fetch("/api/sync/hand-rolled/push", { method: "POST", body: JSON.stringify({ mutations: batch }) });
    } catch {
      setTimeout(() => void this.flush(), 2000); // offline? stays queued, retry
    }
  }

  /** The server says "this is the truth at version N". Rebase on top of it. */
  private onPoke(poke: Poke) {
    this.confirmed = poke.todos;
    this.version = poke.version;
    const last = poke.lastSeq[this.clientId] ?? 0;
    this.pending = this.pending.filter((m) => m.seq > last); // drop confirmed (or rejected) mutations
    for (const a of poke.applied) {
      if (a.clientId !== this.clientId) this.addLog("remote", `← v${poke.version} ${a.name} from ${a.clientId}${a.ok ? "" : " (rejected)"}`, false);
      else if (a.ok) this.addLog("confirm", `← v${poke.version} #${a.seq} confirmed`, false);
      else this.addLog("reject", `✗ #${a.seq} rejected by server → rolled back`, false);
    }
    if (poke.applied.length === 0) this.addLog("info", `← snapshot v${poke.version}`, false);
    this.emit();
  }

  private addLog(kind: LogEntry["kind"], text: string, emit = true) {
    this.log = [{ id: Date.now() + Math.random(), kind, text }, ...this.log].slice(0, 30);
    if (emit) this.emit();
  }

  private emit() {
    this.state = {
      clientId: this.clientId,
      todos: this.pending.reduce(applyMutation, this.confirmed), // ← the rebase
      version: this.version,
      pending: this.pending,
      connected: this.source?.readyState === EventSource.OPEN,
      log: this.log,
    };
    this.listeners.forEach((l) => l());
  }

  subscribe = (cb: () => void) => {
    this.listeners.add(cb);
    return () => void this.listeners.delete(cb);
  };
  getState = () => this.state;
}
