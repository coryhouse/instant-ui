"use client";
import { startTransition, useOptimistic, useState, type FormEvent } from "react";
import type { Todo } from "@/lib/db";
import { TimingBadge, useFeedbackTimer } from "@/components/Timing";
import { ErrorToast, TodoItems, buttonClass, inputClass, type TodoView } from "@/components/todo-ui/TodoUI";
import { addTodoAction, deleteTodoAction, toggleTodoAction } from "./actions";

type OptimisticAction =
  | { type: "add"; todo: TodoView }
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string };

// Pure function: "what the list WILL look like if the server says yes".
function applyOptimistic(todos: TodoView[], action: OptimisticAction): TodoView[] {
  switch (action.type) {
    case "add": return [...todos, action.todo];
    case "toggle": return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done, pending: true } : t));
    case "delete": return todos.filter((t) => t.id !== action.id);
  }
}

/**
 * INSTANT: useOptimistic + Server Actions.
 * The UI updates in the same frame as the click. The optimistic state lives only
 * while the action (transition) is running: on success we commit the real data,
 * on failure React simply drops the optimistic state → automatic rollback.
 */
export function InstantTodos({ initial }: { initial: Todo[] }) {
  const [todos, setTodos] = useState<TodoView[]>(initial);
  const [optimisticTodos, addOptimistic] = useOptimistic(todos, applyOptimistic);
  const [error, setError] = useState<string | null>(null);
  const addTimer = useFeedbackTimer();
  const toggleTimer = useFeedbackTimer();

  function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text) return;
    form.reset(); // the user can type the next one right away
    addTimer.start();
    // Optimistic updates must happen inside a transition (or a <form action>).
    startTransition(async () => {
      addOptimistic({ type: "add", todo: { id: `temp-${crypto.randomUUID()}`, text, done: false, pending: true } });
      addTimer.stop();
      setError(null);
      const res = await addTodoAction(text);
      if (res.ok) startTransition(() => setTodos((ts) => [...ts, res.value]));
      else setError(`Rolled back: ${res.error}`);
    });
  }

  function handleToggle(id: string) {
    if (id.startsWith("temp-")) return; // not saved yet
    toggleTimer.start();
    startTransition(async () => {
      addOptimistic({ type: "toggle", id });
      toggleTimer.stop();
      setError(null);
      const res = await toggleTodoAction(id);
      if (res.ok && res.value) {
        const updated = res.value;
        startTransition(() => setTodos((ts) => ts.map((t) => (t.id === id ? updated : t))));
      } else if (!res.ok) setError(`Rolled back: ${res.error}`);
    });
  }

  function handleDelete(id: string) {
    if (id.startsWith("temp-")) return;
    startTransition(async () => {
      addOptimistic({ type: "delete", id });
      setError(null);
      const res = await deleteTodoAction(id);
      if (res.ok) startTransition(() => setTodos((ts) => ts.filter((t) => t.id !== id)));
      else setError(`Rolled back: ${res.error}`);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <TimingBadge ms={addTimer.ms} label="add" />
        <TimingBadge ms={toggleTimer.ms} label="toggle" />
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="text" placeholder="New todo" autoComplete="off" className={inputClass} />
        <button className={buttonClass}>Add</button>
      </form>
      <ErrorToast message={error} onClose={() => setError(null)} />
      <TodoItems todos={optimisticTodos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}
