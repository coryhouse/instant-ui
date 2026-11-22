"use client";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Measures "time to feedback": from a user interaction until the UI visibly responds.
 * Call `start()` in the event handler, and `stop()` when the change is rendered
 * (or pass a `done` value that changes when the UI updates).
 */
export function useFeedbackTimer() {
  const startedAt = useRef<number | null>(null);
  const [ms, setMs] = useState<number | null>(null);
  const start = useCallback(() => {
    startedAt.current = performance.now();
    setMs(null);
  }, []);
  const stop = useCallback(() => {
    if (startedAt.current === null) return;
    const begin = startedAt.current;
    startedAt.current = null;
    // Wait for the next frame so we measure until the browser paints.
    requestAnimationFrame(() => setMs(Math.round(performance.now() - begin)));
  }, []);
  return { ms, start, stop };
}

/** Stops the timer after the render where `value` changes. */
export function useStopOnChange(value: unknown, stop: () => void) {
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    stop();
  }, [value, stop]);
}

export function TimingBadge({ ms, label = "feedback" }: { ms: number | null; label?: string }) {
  const color = ms === null ? "bg-muted/15 text-muted" : ms < 100 ? "bg-success/15 text-success" : ms < 1000 ? "bg-warning/20 text-warning" : "bg-danger/15 text-danger";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs tabular-nums ${color}`}>
      {label}: {ms === null ? "—" : `${ms}ms`}
    </span>
  );
}
