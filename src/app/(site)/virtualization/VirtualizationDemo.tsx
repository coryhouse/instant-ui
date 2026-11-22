"use client";
import { useMemo, useState, type ComponentType } from "react";
import { Compare } from "@/components/Compare";
import { makeRows, type Row } from "./data";
import { NaiveList } from "./NaiveList";
import { VirtualList } from "./VirtualList";

const COUNTS = [1_000, 10_000, 50_000];

export function VirtualizationDemo() {
  const [count, setCount] = useState(10_000);
  const rows = useMemo(() => makeRows(count), [count]);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted">Rows:</span>
        {COUNTS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCount(n)}
            className={`rounded-md border px-2 py-1 font-mono text-xs ${n === count ? "border-accent bg-accent/15" : "border-border"}`}
          >
            {n.toLocaleString()}
          </button>
        ))}
      </div>
      <Compare
        naiveLabel="Render all rows"
        instantLabel="Virtualized (@tanstack/react-virtual)"
        naive={<Mountable List={NaiveList} rows={rows} />}
        instant={<Mountable List={VirtualList} rows={rows} />}
      />
    </div>
  );
}

/** Mounts the list on click so we can time click → rows committed. */
function Mountable({ List, rows }: { List: ComponentType<{ rows: Row[]; startedAt: number }>; rows: Row[] }) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  return (
    <>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => setStartedAt(performance.now())}
          className="rounded-md bg-accent px-3 py-1 text-sm font-medium text-white"
        >
          {startedAt === null ? "Mount list" : "Remount"}
        </button>
        {startedAt !== null && (
          <button type="button" onClick={() => setStartedAt(null)} className="rounded-md border border-border px-3 py-1 text-sm">
            Unmount
          </button>
        )}
      </div>
      {startedAt === null ? (
        <div className="flex h-96 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted">
          {rows.length.toLocaleString()} rows, not mounted
        </div>
      ) : (
        <List key={`${startedAt}-${rows.length}`} rows={rows} startedAt={startedAt} />
      )}
    </>
  );
}
