"use client";
// Client-only shell: the Zero client is never created on the server, and only after we know
// zero-cache is reachable. If Docker/zero-cache isn't running we show setup steps instead of crashing.
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Compare, Panel } from "@/components/Compare";
import { TodoSkeleton } from "@/components/todo-ui/TodoUI";
import { ZERO_CACHE_URL } from "@/lib/zero/config";
import { FetchTodos } from "./FetchTodos";

const ZeroPanels = dynamic(() => import("./ZeroPanels"), { ssr: false, loading: () => <TodoSkeleton /> });

type Status = "checking" | "up" | "down";

/** zero-cache answers GET / with "OK". `no-cors` = we only care whether the TCP connection works. */
async function isZeroCacheUp() {
  try {
    await fetch(ZERO_CACHE_URL, { mode: "no-cors", cache: "no-store", signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

export function ZeroDemo() {
  const [status, setStatus] = useState<Status>("checking");

  // Poll until zero-cache is up, then stop (Zero's own connection state takes over).
  useEffect(() => {
    if (status === "up") return;
    let cancelled = false;
    const check = async () => {
      const up = await isZeroCacheUp();
      if (!cancelled) setStatus(up ? "up" : "down");
    };
    check();
    const id = setInterval(check, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [status]);

  return (
    <div className="space-y-4">
      <Compare
        naiveLabel="fetch + refetch (same Postgres)"
        instantLabel="Zero: local replica + sync"
        naive={<FetchTodos />}
        instant={status === "up" ? <ZeroPanels device="A" /> : status === "down" ? <StartZero /> : <TodoSkeleton />}
      />
      {status === "up" && (
        <Panel tone="instant" label="Second Zero client (separate in-memory store, same page)">
          <ZeroPanels device="B" />
        </Panel>
      )}
    </div>
  );
}

function StartZero() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">zero-cache isn&apos;t running at <code>{ZERO_CACHE_URL}</code>.</p>
      <p className="text-muted">Start local Postgres (Docker) and zero-cache in two terminals:</p>
      <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed">
{`pnpm zero:up      # Postgres 16 in Docker, port 5434
pnpm zero:cache   # zero-cache on :4848 (keep it running)`}
      </pre>
      <p className="text-xs text-muted">This panel checks every 3s and will connect automatically. Stop later with <code>pnpm zero:down</code>.</p>
    </div>
  );
}
