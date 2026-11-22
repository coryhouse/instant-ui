"use client";
import { useState } from "react";
import type { PrimeResult } from "./primes";

/** Shared UI: run button, result, and a text box + counter to prove input still works. */
export function PrimeUI({ busy, result, onRun }: { busy: boolean; result: PrimeResult | null; onRun: () => void }) {
  const [text, setText] = useState("");
  const [clicks, setClicks] = useState(0);
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onRun}
        disabled={busy}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Computing…" : "Count primes"}
      </button>
      <div className="min-h-12 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm tabular-nums">
        {busy ? (
          <span className="text-muted">Working… (UI still responsive)</span>
        ) : result ? (
          <>
            {result.count.toLocaleString()} primes below {result.limit.toLocaleString()}
            <br />
            <span className="text-muted">took {(result.ms / 1000).toFixed(2)}s</span>
          </>
        ) : (
          <span className="text-muted">No result yet</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type while it runs…"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
        <button type="button" onClick={() => setClicks((c) => c + 1)} className="rounded-md border border-border px-3 text-sm tabular-nums">
          +1 ({clicks})
        </button>
      </div>
    </div>
  );
}
