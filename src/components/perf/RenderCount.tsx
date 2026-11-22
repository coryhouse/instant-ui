"use client";
import type { RefObject } from "react";

/** The badge a `useRenderCounter()` ref is attached to. */
export function RenderCount({ countRef, label = "renders" }: { countRef: RefObject<HTMLSpanElement | null>; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/15 px-2 py-0.5 font-mono text-xs tabular-nums text-muted">
      {label}:{" "}
      <span ref={countRef} className="rounded px-1 font-semibold text-foreground">
        0
      </span>
    </span>
  );
}
