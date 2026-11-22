"use client";
import type { ReactNode } from "react";

/** Presentational todo list shared by the optimistic, local-first and sync demos. */
export type TodoView = { id: string; text: string; done: boolean; pending?: boolean };

export function TodoItems({ todos, onToggle, onDelete, disabled, empty = "Nothing to do 🎉" }: {
  todos: TodoView[] | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  empty?: ReactNode;
}) {
  if (!todos) return <TodoSkeleton />;
  if (todos.length === 0) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {todos.map((t) => (
        <li key={t.id} className={`flex items-center gap-3 px-3 py-2 transition-opacity ${t.pending ? "opacity-50" : ""}`}>
          <input
            type="checkbox"
            checked={t.done}
            disabled={disabled}
            onChange={() => onToggle(t.id)}
            className="size-4 accent-accent"
            aria-label={`Toggle ${t.text}`}
          />
          <span className={`flex-1 text-sm ${t.done ? "text-muted line-through" : ""}`}>{t.text}</span>
          {t.pending && <span className="text-xs italic text-muted">saving…</span>}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onDelete(t.id)}
            className="rounded px-1.5 text-muted hover:bg-danger/15 hover:text-danger disabled:opacity-40"
            aria-label={`Delete ${t.text}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TodoSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="space-y-2" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <li key={i} className="skeleton h-9 rounded-lg" />)}
    </ul>
  );
}

export function Spinner() {
  return <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]" aria-hidden />;
}

export function ErrorToast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start justify-between gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
      <span>{message}</span>
      <button type="button" onClick={onClose} className="text-xs underline">dismiss</button>
    </div>
  );
}

export const inputClass = "flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm disabled:opacity-50";
export const buttonClass = "inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50";
