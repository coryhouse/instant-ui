"use client";
import { useEffect, useRef, useState } from "react";
import type { PrimeResult } from "./primes";
import { PrimeUI } from "./PrimeUI";

/**
 * INSTANT: the same function, run in a Web Worker (a separate thread).
 * The main thread just posts a message and stays free to animate and respond
 * to input; the result arrives later as a message.
 */
export function WorkerPrimes({ limit }: { limit: number }) {
  const worker = useRef<Worker | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PrimeResult | null>(null);

  useEffect(() => {
    const w = new Worker(new URL("./primes.worker.ts", import.meta.url), { type: "module" });
    w.onmessage = (e: MessageEvent<PrimeResult>) => {
      setResult(e.data);
      setBusy(false);
    };
    worker.current = w;
    return () => w.terminate();
  }, []);

  function run() {
    setBusy(true);
    worker.current?.postMessage(limit);
  }

  return <PrimeUI busy={busy} result={result} onRun={run} />;
}
