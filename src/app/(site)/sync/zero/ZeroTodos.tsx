"use client";
// INSTANT: Zero. Reads come from a local replica (useQuery), writes run the mutator locally
// first (same frame), then zero-cache pushes them to Postgres and fans changes out to every client.
import { useState } from "react";
import { ZeroProvider, useConnectionState, useQuery, useZero } from "@rocicorp/zero/react";
import { schema } from "@/lib/zero/schema";
import { mutators } from "@/lib/zero/mutators";
import { queries, type Filter } from "@/lib/zero/queries";
import { FilterTabs } from "./FilterTabs";
import { ZERO_CACHE_URL } from "@/lib/zero/config";
import { TimingBadge, useFeedbackTimer, useStopOnChange } from "@/components/Timing";
import { ErrorToast, TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";

/** One Zero client (anonymous: no userID/auth for this demo). `kvStore="mem"` gives a second, fully independent client in the same tab. */
export function ZeroClient({ kvStore = "idb", children }: { kvStore?: "idb" | "mem"; children: React.ReactNode }) {
  return (
    <ZeroProvider cacheURL={ZERO_CACHE_URL} schema={schema} mutators={mutators} kvStore={kvStore}>
      {children}
    </ZeroProvider>
  );
}

export function ZeroTodos({ compact = false }: { compact?: boolean }) {
  const zero = useZero();
  const [filter, setFilter] = useState<Filter>("all");
  const [todos, result] = useQuery(queries.todos.list({ filter }));
  const [text, setText] = useState("");
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { ms, start, stop } = useFeedbackTimer();
  useStopOnChange(todos, stop);

  // Write locally now; count the server confirmation separately so you can SEE it lag behind.
  function run(mutation: Parameters<typeof zero.mutate>[0]) {
    start();
    setPending((n) => n + 1);
    zero.mutate(mutation).server.then((r) => {
      setPending((n) => n - 1);
      if (r.type === "error") setError(`Server rejected the write, rolled back: ${r.error.message}`);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <ConnectionPill />
        <TimingBadge ms={ms} />
        <span className="text-xs text-muted">{pending > 0 ? `${pending} awaiting server…` : "all synced"}</span>
      </div>
      {!compact && (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            run(mutators.todo.add({ id: crypto.randomUUID(), title: text, createdAt: Date.now() }));
            setText("");
          }}
        >
          <input className={inputClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a todo…" aria-label="New todo" />
          <button className={buttonClass}>Add</button>
        </form>
      )}
      <FilterTabs value={filter} onChange={(f) => { start(); setFilter(f); }} />
      <ErrorToast message={error} onClose={() => setError(null)} />
      <TodoItems
        todos={result.type === "unknown" && todos.length === 0 ? undefined : todos.map((t) => ({ id: t.id, text: t.title, done: t.done }))}
        onToggle={(id) => run(mutators.todo.toggle({ id, done: !todos.find((t) => t.id === id)?.done }))}
        onDelete={(id) => run(mutators.todo.remove({ id }))}
      />
      <p className="text-xs text-muted">Query result: <code>{result.type}</code> (local replica{result.type === "complete" ? ", confirmed by server" : ""})</p>
    </div>
  );
}

function ConnectionPill() {
  const state = useConnectionState();
  const color = state.name === "connected" ? "bg-success/15 text-success" : state.name === "connecting" ? "bg-warning/20 text-warning" : "bg-danger/15 text-danger";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${color}`} title={"reason" in state ? String(state.reason ?? "") : undefined}>
      <span className="size-1.5 rounded-full bg-current" /> {state.name}
    </span>
  );
}
