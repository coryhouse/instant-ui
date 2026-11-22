"use client";
import { useLiveQuery } from "dexie-react-hooks";
import type { FormEvent } from "react";
import { TimingBadge, useFeedbackTimer, useStopOnChange } from "@/components/Timing";
import { TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import { addLocal, db, deleteLocal, toggleLocal } from "@/lib/local-first/client-db";
import { requestSync, useSyncLoop } from "@/lib/local-first/sync";

/**
 * INSTANT: local-first. The UI reads from and writes to IndexedDB (~0ms), and
 * useLiveQuery re-renders whenever the local data changes. The network is just
 * a background sync detail: offline, writes queue up in the outbox.
 */
export function LocalFirstTodos() {
  const todos = useLiveQuery(() => db.todos.orderBy("createdAt").filter((t) => !t.deleted).toArray(), []);
  const outbox = useLiveQuery(() => db.todos.where("dirty").equals(1).count(), []);
  const sync = useSyncLoop();
  const writeTimer = useFeedbackTimer();
  useStopOnChange(todos, writeTimer.stop); // stop when the live query re-renders

  async function write(fn: () => Promise<void>) {
    writeTimer.start();
    await fn(); // local write: no network involved
    requestSync(); // fire-and-forget; works offline (it just waits)
  }

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    form.reset();
    void write(() => addLocal(text));
  }

  async function resetLocal() {
    await db.transaction("rw", db.todos, db.meta, () => Promise.all([db.todos.clear(), db.meta.clear()]));
    requestSync();
  }

  const dirty = new Set(todos?.filter((t) => t.dirty).map((t) => t.id));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={writeTimer.ms} label="write" />
        <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${outbox ? "bg-warning/20 text-warning" : "bg-success/15 text-success"}`}>
          outbox: {outbox ?? 0}
        </span>
        <span className="font-mono text-xs text-muted">
          {sync.state === "syncing" ? "⟳ syncing…" : sync.state === "offline" ? "✈ offline — changes queued" : sync.state === "error" ? `⚠ ${sync.error}` : "✓ synced"}
        </span>
        <button type="button" onClick={resetLocal} className="ml-auto text-xs text-muted underline">
          Clear IndexedDB
        </button>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" className={inputClass} />
        <button className={buttonClass}>Add</button>
      </form>
      <TodoItems
        todos={todos?.map((t) => ({ ...t, pending: dirty.has(t.id) }))}
        onToggle={(id) => write(() => toggleLocal(id))}
        onDelete={(id) => write(() => deleteLocal(id))}
      />
      <p className="text-xs text-muted">Faded rows are saved locally but not yet on the server.</p>
    </div>
  );
}
