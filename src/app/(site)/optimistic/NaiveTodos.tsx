"use client";
import { useState, type FormEvent } from "react";
import type { Todo } from "@/lib/db";
import { TimingBadge, useFeedbackTimer } from "@/components/Timing";
import { ErrorToast, Spinner, TodoItems, buttonClass, inputClass } from "@/components/todo-ui/TodoUI";
import { addTodoAction, deleteTodoAction, toggleTodoAction } from "./actions";

/**
 * NAIVE: wait for the server, then show the result.
 * Every click disables the UI and shows a spinner for a full round trip,
 * so "time to feedback" = network latency + server work.
 */
export function NaiveTodos({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTimer = useFeedbackTimer();
  const toggleTimer = useFeedbackTimer();

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    addTimer.start();
    setBusy(true);
    setError(null);
    const res = await addTodoAction(text); // ⏳ nothing happens until this resolves
    setBusy(false);
    if (res.ok) {
      setTodos((ts) => [...ts, res.value]);
      form.reset();
    } else setError(res.error);
    addTimer.stop();
  }

  async function handleToggle(id: string) {
    toggleTimer.start();
    setBusy(true);
    setError(null);
    const res = await toggleTodoAction(id);
    setBusy(false);
    if (res.ok && res.value) {
      const updated = res.value;
      setTodos((ts) => ts.map((t) => (t.id === id ? updated : t)));
    } else if (!res.ok) setError(res.error);
    toggleTimer.stop();
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    const res = await deleteTodoAction(id);
    setBusy(false);
    if (res.ok) setTodos((ts) => ts.filter((t) => t.id !== id));
    else setError(res.error);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <TimingBadge ms={addTimer.ms} label="add" />
        <TimingBadge ms={toggleTimer.ms} label="toggle" />
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" disabled={busy} className={inputClass} />
        <button disabled={busy} className={buttonClass}>
          {busy && <Spinner />} {busy ? "Saving…" : "Add"}
        </button>
      </form>
      <ErrorToast message={error} onClose={() => setError(null)} />
      <TodoItems todos={todos} onToggle={handleToggle} onDelete={handleDelete} disabled={busy} />
    </div>
  );
}
