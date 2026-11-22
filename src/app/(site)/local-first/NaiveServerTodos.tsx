"use client";
import { useEffect, useState, type FormEvent } from "react";
import { TimingBadge, useFeedbackTimer } from "@/components/Timing";
import { ErrorToast, Spinner, TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import { lfFetch } from "@/lib/local-first/network";
import type { LfTodo } from "@/lib/local-first/server-store";

/**
 * NAIVE: the server is the only source of truth.
 * Every read and every write is a network round trip, so the UI is as slow as
 * the network — and when the network is gone, the app is gone too.
 */
export function NaiveServerTodos() {
  const [todos, setTodos] = useState<LfTodo[] | undefined>();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const readTimer = useFeedbackTimer();
  const writeTimer = useFeedbackTimer();

  async function call(timer: typeof readTimer, url: string, init?: RequestInit) {
    timer.start();
    setBusy(true);
    setError(null);
    try {
      setTodos(await lfFetch(url, init)); // ⏳ wait for the server, every time
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      timer.stop();
    }
  }
  const load = () => call(readTimer, "/api/local-first/todos");
  const write = (method: string, body: object) => call(writeTimer, "/api/local-first/todos", { method, body: JSON.stringify(body) });

  // Initial read: on every page load, wait for the server.
  const { start: startRead, stop: stopRead } = readTimer;
  useEffect(() => {
    startRead();
    lfFetch("/api/local-first/todos")
      .then(setTodos, (e: Error) => setError(e.message))
      .finally(() => {
        setBusy(false);
        stopRead();
      });
  }, [startRead, stopRead]);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    await write("POST", { text });
    form.reset();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={readTimer.ms} label="read" />
        <TimingBadge ms={writeTimer.ms} label="write" />
        <button type="button" onClick={load} disabled={busy} className="ml-auto text-xs text-muted underline disabled:opacity-50">
          Reload from server
        </button>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" disabled={busy} className={inputClass} />
        <button disabled={busy} className={buttonClass}>
          {busy && <Spinner />} {busy ? "Waiting…" : "Add"}
        </button>
      </form>
      <ErrorToast message={error} onClose={() => setError(null)} />
      <TodoItems
        todos={todos}
        disabled={busy}
        onToggle={(id) => write("PATCH", { id })}
        onDelete={(id) => write("DELETE", { id })}
        empty={error ? "Couldn't load todos." : undefined}
      />
    </div>
  );
}
