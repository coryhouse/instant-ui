"use client";
import { useState } from "react";
import { countPrimes, type PrimeResult } from "./primes";
import { PrimeUI } from "./PrimeUI";

/**
 * NAIVE: run the computation in the click handler, on the main thread.
 * For the next few seconds nothing else can run: no rendering, no animation,
 * no input. Even the "Computing…" state never paints.
 */
export function MainThreadPrimes({ limit }: { limit: number }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PrimeResult | null>(null);

  function run() {
    setBusy(true); // never visible: we block before React can render it
    const start = performance.now();
    const count = countPrimes(limit);
    setResult({ limit, count, ms: Math.round(performance.now() - start) });
    setBusy(false);
  }

  return <PrimeUI busy={busy} result={result} onRun={run} />;
}
