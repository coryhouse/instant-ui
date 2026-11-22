"use client";
import { useState } from "react";
import { TimingBadge } from "@/components/Timing";

type Stats = Record<string, { full: number; notModified: number }>;
type Result = { ms: number; source: "browser cache" | "network" | "304 revalidated"; bytes: number; body: { serverHit: number; servedAt: string } };

/** Measures one fetch: wall-clock time, and whether the browser's HTTP cache answered it. */
async function timedFetch(url: string): Promise<Omit<Result, "source"> & { transferSize: number | null }> {
  const t0 = performance.now();
  const res = await fetch(url); // default cache mode: the browser honors Cache-Control
  const body = await res.json();
  const ms = Math.round(performance.now() - t0);
  // The resource-timing entry can land a tick after the body resolves.
  const abs = new URL(url, location.href).href;
  let entry: PerformanceResourceTiming | undefined;
  for (let i = 0; i < 10 && !entry; i++) {
    entry = (performance.getEntriesByName(abs) as PerformanceResourceTiming[]).at(-1);
    if (!entry) await new Promise((r) => setTimeout(r, 10));
  }
  performance.clearResourceTimings();
  // transferSize === 0 means nothing came over the wire: served from the HTTP cache.
  return { ms, body, bytes: entry?.decodedBodySize ?? 0, transferSize: entry ? entry.transferSize : null };
}

export function EndpointTester({ endpoint, header }: { endpoint: "no-store" | "max-age" | "etag"; header: string }) {
  const url = `/api/caching/http/${endpoint}`;
  const [result, setResult] = useState<Result | null>(null);
  const [stats, setStats] = useState<Stats[string] | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const before: Stats = await fetch("/api/caching/http/stats", { cache: "no-store" }).then((r) => r.json());
    const r = await timedFetch(url);
    const after: Stats = await fetch("/api/caching/http/stats", { cache: "no-store" }).then((r) => r.json());
    const got304 = after[endpoint].notModified > before[endpoint].notModified;
    const source = r.transferSize === 0 ? "browser cache" : got304 ? "304 revalidated" : "network";
    setResult({ ms: r.ms, bytes: r.bytes, body: r.body, source });
    setStats(after[endpoint]);
    setBusy(false);
  }

  const total = stats ? stats.full + stats.notModified : null;
  return (
    <div className="space-y-3">
      <code className="block rounded bg-background px-2 py-1 text-xs">Cache-Control: {header}</code>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={run} disabled={busy} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          {busy ? "Fetching…" : `GET ${url}`}
        </button>
        <TimingBadge ms={result?.ms ?? null} label="fetch" />
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted">Answered by</dt>
        <dd className={result?.source === "network" ? "text-danger" : result ? "text-success" : ""}>
          {result ? result.source : "—"}
        </dd>
        <dt className="text-muted">Response says server hit #</dt>
        <dd className="font-mono">{result?.body.serverHit ?? "—"}</dd>
        <dt className="text-muted">Response generated at</dt>
        <dd className="font-mono">{result ? new Date(result.body.servedAt).toLocaleTimeString() : "—"}</dd>
        <dt className="text-muted">Server actually called</dt>
        <dd className="font-mono">
          {total === null ? "—" : `${total}×`}
          {stats && endpoint === "etag" && <span className="text-muted"> ({stats.full} full, {stats.notModified} × 304)</span>}
        </dd>
      </dl>
    </div>
  );
}

export function ResetStats() {
  return (
    <button
      onClick={() => fetch("/api/caching/http/stats", { method: "POST" })}
      className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-background"
    >
      Reset server counters
    </button>
  );
}
