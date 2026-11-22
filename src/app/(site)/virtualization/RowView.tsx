import type { CSSProperties } from "react";
import type { Row } from "./data";

/** One table row: ~8 DOM nodes. */
export function RowView({ row, style }: { row: Row; style?: CSSProperties }) {
  return (
    <div style={style} className="flex h-10 items-center gap-3 border-b border-border px-3 text-sm">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: `hsl(${row.hue} 60% 50%)` }}
      >
        {row.name[0]}
      </span>
      <span className="w-14 shrink-0 font-mono text-xs text-muted">#{row.id}</span>
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium">{row.name}</span> <span className="text-muted">{row.email}</span>
      </span>
      <span className="font-mono text-xs tabular-nums">{row.amount}</span>
    </div>
  );
}
