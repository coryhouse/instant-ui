"use client";
import { useSettings } from "@/lib/client-settings";

const queries = [
  { name: "product", factor: 0.6, color: "bg-accent" },
  { name: "reviews", factor: 1.0, color: "bg-warning" },
  { name: "recs", factor: 1.4, color: "bg-success" },
];

/** Expected timeline for the current latency: sequential vs parallel. */
export function Waterfall() {
  const { latency } = useSettings();
  const sequential = queries.reduce((sum, q) => sum + q.factor * latency, 0);
  const parallel = Math.max(...queries.map((q) => q.factor * latency));
  return (
    <div className="grid gap-4 rounded-xl border border-border bg-surface p-4 md:grid-cols-2">
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-danger">Sequential awaits</span>
          <span className="font-mono">{Math.round(sequential)}ms</span>
        </div>
        {queries.map((q, i) => {
          const start = queries.slice(0, i).reduce((sum, prev) => sum + prev.factor * latency, 0);
          return <Row key={q.name} q={q} start={start} latency={latency} total={sequential} />;
        })}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-success">Parallel + Suspense</span>
          <span className="font-mono">{Math.round(parallel)}ms</span>
        </div>
        {queries.map((q) => <Row key={q.name} q={q} start={0} latency={latency} total={sequential} />)}
      </div>
    </div>
  );
}

function Row({ start, q, latency, total }: { start: number; q: (typeof queries)[number]; latency: number; total: number }) {
  const pct = (ms: number) => `${(ms / Math.max(total, 1)) * 100}%`;
  return (
    <div className="relative h-6">
      <div
        className={`absolute top-0 flex h-6 items-center rounded px-2 font-mono text-xs text-white ${q.color}`}
        style={{ left: pct(start), width: pct(q.factor * latency) }}
      >
        {q.name}
      </div>
    </div>
  );
}
