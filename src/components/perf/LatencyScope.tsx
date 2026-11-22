"use client";
import { useRef, useState, type ReactNode } from "react";

/**
 * Measures input latency for interactions inside its children:
 * from the event's timestamp (when the OS delivered the key/click) until the
 * next frame is painted. That's what the user feels, and roughly what INP
 * (Interaction to Next Paint) reports.
 */
export function LatencyScope({ children, label = "input latency" }: { children: ReactNode; label?: string }) {
  const [last, setLast] = useState<number | null>(null);
  const [worst, setWorst] = useState<number | null>(null);
  const pending = useRef(false);

  function measure(e: { timeStamp: number; target: EventTarget }) {
    if (e.target instanceof Element && e.target.closest("[data-latency-ignore]")) return;
    if (pending.current) return; // one measurement per frame
    pending.current = true;
    const start = e.timeStamp;
    // rAF runs right before the next paint; a task queued from it runs right after.
    requestAnimationFrame(() => {
      setTimeout(() => {
        pending.current = false;
        const ms = Math.round(performance.now() - start);
        setLast(ms);
        setWorst((w) => (w === null ? ms : Math.max(w, ms)));
      }, 0);
    });
  }

  return (
    <div onKeyDownCapture={measure} onClickCapture={measure}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <LatencyBadge label={label} ms={last} />
        <LatencyBadge label="worst" ms={worst} />
        {worst !== null && (
          <button
            type="button"
            data-latency-ignore
            className="text-xs text-muted underline"
            onClick={() => {
              setLast(null);
              setWorst(null);
            }}
          >
            reset
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function LatencyBadge({ label, ms }: { label: string; ms: number | null }) {
  // INP thresholds: good ≤ 200ms, poor > 500ms. Under ~50ms feels instant.
  const color = ms === null ? "bg-muted/15 text-muted" : ms <= 50 ? "bg-success/15 text-success" : ms <= 200 ? "bg-warning/20 text-warning" : "bg-danger/15 text-danger";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs tabular-nums ${color}`}>
      {label}: {ms === null ? "—" : `${ms}ms`}
    </span>
  );
}
