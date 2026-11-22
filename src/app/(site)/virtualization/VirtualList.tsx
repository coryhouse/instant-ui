"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ROW_HEIGHT, type Row } from "./data";
import { RowView } from "./RowView";
import { Stats } from "./Stats";
import { useListStats } from "./useListStats";

/**
 * INSTANT: windowing. Only the rows in view (+ a few overscan) exist in the DOM;
 * a tall spacer div keeps the scrollbar honest. Cost is constant, whatever the row count.
 */
export function VirtualList({ rows, startedAt }: { rows: Row[]; startedAt: number }) {
  "use no memo"; // useVirtualizer returns a mutable object the React Compiler can't track.
  const { ref, mountMs, nodes } = useListStats(startedAt);
  // eslint-disable-next-line react-hooks/incompatible-library -- opted out above
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <>
      <Stats mountMs={mountMs} nodes={nodes} />
      <div ref={ref} className="h-96 overflow-y-auto rounded-md border border-border">
        <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
          {virtualizer.getVirtualItems().map((item) => (
            <RowView
              key={item.key}
              row={rows[item.index]}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${item.start}px)` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
