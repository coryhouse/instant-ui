"use client";
import type { Row } from "./data";
import { RowView } from "./RowView";
import { Stats } from "./Stats";
import { useListStats } from "./useListStats";

/**
 * NAIVE: render every row. 10,000 rows ≈ 80,000 DOM nodes to create, style,
 * lay out and keep in memory, even though only ~10 are visible.
 */
export function NaiveList({ rows, startedAt }: { rows: Row[]; startedAt: number }) {
  const { ref, mountMs, nodes } = useListStats(startedAt);
  return (
    <>
      <Stats mountMs={mountMs} nodes={nodes} />
      <div ref={ref} className="h-96 overflow-y-auto rounded-md border border-border">
        {rows.map((row) => (
          <RowView key={row.id} row={row} />
        ))}
      </div>
    </>
  );
}
