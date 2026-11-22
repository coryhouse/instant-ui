"use client";
// NAIVE: fetch + refetch. Same Postgres table, but every click waits for the server round trip,
// then refetches the whole list. Filtering is a new request too. No push: other windows go stale.
import { useEffect, useState } from "react";
import type { Filter } from "@/lib/zero/queries";
import { TimingBadge, useFeedbackTimer, useStopOnChange } from "@/components/Timing";
import { ErrorToast, Spinner, TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import { FilterTabs } from "./FilterTabs";

type Todo = { id: string; title: string; done: boolean };

async function loadTodos(): Promise<Todo[]> {
  const res = await fetch("/api/zero/todos", { cache: "no-store" });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export function FetchTodos() {
  const [todos, setTodos] = useState<Todo[]>();
  const [filter, setFilter] = useState<Filter>("all");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ms, start, stop } = useFeedbackTimer();
  useStopOnChange(todos, stop);

  const refetch = () => loadTodos().then(setTodos);

  async function write(body: object) {
    start();
    setBusy(true);
    try {
      const res = await fetch("/api/zero/todos", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Write failed");
      await refetch(); // second round trip just to see our own write
    } catch (e) {
      setError(String((e as Error).message));
      stop();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadTodos().then(setTodos, (e) => setError(String(e.message)));
  }, []);

  // Filtering waits on the network, so the list only changes after a full refetch.
  const visible = todos?.filter((t) => filter === "all" || t.done === (filter === "done"));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={ms} />
        <span className="text-xs text-muted">{busy ? <><Spinner /> waiting for server…</> : "idle (no live updates)"}</span>
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          write({ action: "add", title: text.trim() });
          setText("");
        }}
      >
        <input className={inputClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a todo…" aria-label="New todo (naive)" disabled={busy} />
        <button className={buttonClass} disabled={busy}>Add</button>
      </form>
      <FilterTabs
        value={filter}
        onChange={async (f) => {
          start();
          setBusy(true);
          await refetch().catch((e) => setError(String(e.message)));
          setFilter(f);
          setBusy(false);
        }}
      />
      <ErrorToast message={error} onClose={() => setError(null)} />
      <TodoItems
        todos={visible?.map((t) => ({ id: t.id, text: t.title, done: t.done }))}
        disabled={busy}
        onToggle={(id) => write({ action: "toggle", id, done: !todos?.find((t) => t.id === id)?.done })}
        onDelete={(id) => write({ action: "remove", id })}
      />
    </div>
  );
}
