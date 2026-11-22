"use client";
import { useState } from "react";
import { Compare } from "@/components/Compare";
import { LatencyScope } from "@/components/perf";
import { MainThreadPrimes } from "./MainThreadPrimes";
import { WorkerPrimes } from "./WorkerPrimes";

const LIMITS = [5_000_000, 10_000_000, 15_000_000];

export function WorkersDemo() {
  const [limit, setLimit] = useState(10_000_000);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">Count primes below:</span>
        {LIMITS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setLimit(n)}
            className={`rounded-md border px-2 py-1 font-mono text-xs ${n === limit ? "border-accent bg-accent/15" : "border-border"}`}
          >
            {n / 1_000_000}M
          </button>
        ))}
      </div>
      <Compare
        naiveLabel="Main thread"
        instantLabel="Web Worker"
        naive={<LatencyScope><MainThreadPrimes limit={limit} /></LatencyScope>}
        instant={<LatencyScope><WorkerPrimes limit={limit} /></LatencyScope>}
      />
    </div>
  );
}
