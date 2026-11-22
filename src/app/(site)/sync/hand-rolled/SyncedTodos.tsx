"use client";
import { useEffect, useSyncExternalStore, type FormEvent } from "react";
import { TimingBadge, useFeedbackTimer, useStopOnChange } from "@/components/Timing";
import { TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import { EMPTY_STATE, SyncClient, type LogEntry } from "@/lib/sync-engine/client";

// One sync client per browser tab, created lazily (never on the server).
let client: SyncClient | null = null;
const getClient = () => (client ??= new SyncClient());
const subscribe = (cb: () => void) => getClient().subscribe(cb);
const getState = () => getClient().getState();

/**
 * INSTANT: the hand-rolled sync engine. Writes apply locally first, go into a
 * mutation queue, get pushed to the server, and come back to EVERY client via
 * SSE. Pending mutations are rebased on top of each confirmed server state.
 */
export function SyncedTodos() {
  const state = useSyncExternalStore(subscribe, getState, () => EMPTY_STATE);
  const timer = useFeedbackTimer();
  useStopOnChange(state.todos, timer.stop);

  useEffect(() => {
    const c = getClient();
    c.connect();
    return () => c.disconnect(); // closes the SSE stream on unmount / HMR
  }, []);

  const pendingIds = new Set(state.pending.map((m) => m.args.id));

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    form.reset();
    timer.start();
    getClient().mutate({ name: "add", args: { id: crypto.randomUUID(), text } });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={timer.ms} label="write" />
        <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${state.pending.length ? "bg-warning/20 text-warning" : "bg-success/15 text-success"}`}>
          pending: {state.pending.length}
        </span>
        <span className="font-mono text-xs text-muted">
          v{state.version} · client {state.clientId || "…"} · {state.connected ? "● live" : "○ connecting"}
        </span>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" className={inputClass} />
        <button className={buttonClass}>Add</button>
      </form>
      <TodoItems
        todos={state.version ? state.todos.map((t) => ({ ...t, pending: pendingIds.has(t.id) })) : undefined}
        onToggle={(id) => {
          timer.start();
          getClient().mutate({ name: "toggle", args: { id } });
        }}
        onDelete={(id) => getClient().mutate({ name: "delete", args: { id } })}
      />
      <SyncLog log={state.log} />
    </div>
  );
}

const logColor: Record<LogEntry["kind"], string> = {
  local: "text-accent",
  push: "text-warning",
  confirm: "text-success",
  remote: "text-foreground",
  reject: "text-danger",
  info: "text-muted",
};

function SyncLog({ log }: { log: LogEntry[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Sync log</p>
      <ol className="h-40 overflow-y-auto font-mono text-xs leading-5">
        {log.map((entry) => (
          <li key={entry.id} className={logColor[entry.kind]}>{entry.text}</li>
        ))}
      </ol>
    </div>
  );
}
