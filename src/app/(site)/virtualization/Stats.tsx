export function Stats({ mountMs, nodes }: { mountMs: number | null; nodes: number }) {
  const color = mountMs === null ? "text-muted" : mountMs < 50 ? "text-success" : mountMs < 300 ? "text-warning" : "text-danger";
  return (
    <div className="mb-2 flex flex-wrap gap-2 font-mono text-xs tabular-nums">
      <span className="rounded-full bg-muted/15 px-2 py-0.5">
        mount: <span className={`font-semibold ${color}`}>{mountMs === null ? "—" : `${mountMs}ms`}</span>
      </span>
      <span className="rounded-full bg-muted/15 px-2 py-0.5">
        DOM nodes: <span className="font-semibold text-foreground">{nodes.toLocaleString()}</span>
      </span>
    </div>
  );
}
