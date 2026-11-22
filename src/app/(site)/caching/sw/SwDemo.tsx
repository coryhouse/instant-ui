"use client";
import { useEffect, useState } from "react";
import { Compare } from "@/components/Compare";
import { TimingBadge } from "@/components/Timing";

const SCOPE = "/caching/sw";

type Deals = { deals: { id: number; name: string; price: number }[]; servedAt: string };
type Result = { ms: number; source: string; data?: Deals; error?: string };

/** Fetches an endpoint and reports how long it took and who answered (SW cache or network). */
async function timedFetch(url: string): Promise<Result> {
  const t0 = performance.now();
  try {
    const res = await fetch(url);
    const data = await res.json();
    const ms = Math.round(performance.now() - t0);
    if (!res.ok) return { ms, source: res.headers.get("x-sw-cache") ?? "network", error: data.error ?? res.statusText };
    // Our service worker tags responses it handled with x-sw-cache: hit | miss.
    const sw = res.headers.get("x-sw-cache");
    return { ms, data, source: sw === "hit" ? "service worker cache" : sw === "miss" ? "network (via SW, now cached)" : "network" };
  } catch {
    return { ms: Math.round(performance.now() - t0), source: "network", error: "Failed to fetch (offline?)" };
  }
}

function useSwStatus() {
  const [status, setStatus] = useState({ supported: true, registered: false, state: "—", controlled: false });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setStatus((s) => ({ ...s, supported: false })); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let cancelled = false;
    const update = async () => {
      const reg = await navigator.serviceWorker.getRegistration(SCOPE);
      const sw = reg?.active ?? reg?.waiting ?? reg?.installing;
      if (!cancelled) setStatus({ supported: true, registered: !!reg, state: sw?.state ?? "—", controlled: !!navigator.serviceWorker.controller });
      sw?.addEventListener("statechange", update, { once: true });
    };
    update();
    navigator.serviceWorker.addEventListener("controllerchange", update);
    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", update);
    };
  }, [tick]);
  return { status, refresh: () => setTick((t) => t + 1) };
}

export function SwDemo() {
  const { status, refresh } = useSwStatus();

  async function register() {
    await navigator.serviceWorker.register("/sw-demo.js", { scope: SCOPE });
    refresh();
  }
  async function unregister() {
    const reg = await navigator.serviceWorker.getRegistration(SCOPE);
    await reg?.unregister();
    await caches.delete("sw-demo-v1");
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
        <button onClick={register} className="rounded-lg bg-accent px-3 py-1.5 font-medium text-white hover:opacity-90">Register SW</button>
        <button onClick={unregister} className="rounded-lg border border-border px-3 py-1.5 hover:bg-background">Unregister + clear cache</button>
        {!status.supported ? (
          <span className="text-danger">Service workers not supported here (needs localhost or HTTPS).</span>
        ) : (
          <span className="flex flex-wrap gap-3">
            <span>Registered: <b className={status.registered ? "text-success" : "text-muted"}>{status.registered ? "yes" : "no"}</b></span>
            <span>State: <b>{status.state}</b></span>
            <span>Controls this page: <b className={status.controlled ? "text-success" : "text-warning"}>{status.controlled ? "yes" : "no"}</b></span>
          </span>
        )}
        {status.registered && !status.controlled && status.state === "activated" && (
          <span className="text-warning">Reload the page (normal reload, not Shift+reload) so the SW controls it.</span>
        )}
      </div>
      <Compare
        naiveLabel="Network only (not intercepted)"
        instantLabel="Service worker: stale-while-revalidate"
        naive={<Fetcher url="/api/caching/sw-naive/data" />}
        instant={<Fetcher url="/api/caching/sw/data" showBadge />}
      />
    </div>
  );
}

function Fetcher({ url, showBadge = false }: { url: string; showBadge?: boolean }) {
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    setResult(await timedFetch(url));
    setBusy(false);
  }
  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={run} disabled={busy} className="rounded-lg bg-accent px-3 py-1.5 font-medium text-white hover:opacity-90 disabled:opacity-50">
          {busy ? "Fetching…" : `GET ${url}`}
        </button>
        <TimingBadge ms={result?.ms ?? null} label="fetch" />
      </div>
      <p>
        Answered by:{" "}
        <b className={result?.source === "service worker cache" ? "text-success" : result ? "text-danger" : ""}>{result?.source ?? "—"}</b>
      </p>
      {result?.error && <p className="text-danger">{result.error}</p>}
      {result?.data && (
        <>
          <p className="text-xs text-muted">Generated by the server at {new Date(result.data.servedAt).toLocaleTimeString()}</p>
          <ul className="space-y-1">
            {result.data.deals.map((d) => (
              <li key={d.id} className="flex justify-between rounded border border-border px-2 py-1">
                <span>{d.name}</span>
                <span className="text-muted">${d.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {showBadge && (
        <p className="flex items-center gap-2 text-xs text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img so the SW (cache-first) serves it */}
          <img src="/sw-demo/badge.svg" alt="cached badge" width={90} height={30} />
          static asset, cache-first (precached on install)
        </p>
      )}
    </div>
  );
}
