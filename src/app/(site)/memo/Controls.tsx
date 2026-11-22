"use client";
import type { Sort } from "./SlowList";

/** Shared input + sort toggle so the three panels look identical. */
export function Controls({ text, onText, sort, onSort }: { text: string; onText: (t: string) => void; sort: Sort; onSort: (s: Sort) => void }) {
  return (
    <div className="mb-3 flex gap-2">
      <input
        value={text}
        onChange={(e) => onText(e.target.value)}
        placeholder="Type fast here…"
        className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
      />
      <button type="button" onClick={() => onSort(sort === "asc" ? "desc" : "asc")} className="rounded-md border border-border px-2 text-xs">
        Sort {sort === "asc" ? "↓" : "↑"}
      </button>
    </div>
  );
}
