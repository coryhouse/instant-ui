"use client";
import type { Filter } from "@/lib/zero/queries";

export function FilterTabs({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5 text-xs" role="tablist">
      {(["all", "open", "done"] as const).map((f) => (
        <button
          key={f}
          type="button"
          role="tab"
          aria-selected={value === f}
          onClick={() => onChange(f)}
          className={`rounded px-2.5 py-1 capitalize ${value === f ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
