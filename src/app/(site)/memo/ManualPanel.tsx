"use client";
import { memo, useCallback, useMemo, useState } from "react";
import { RenderCount, useRenderCounter } from "@/components/perf";
import { Controls } from "./Controls";
import { ITEMS, SlowList, sortItems, type Sort } from "./SlowList";

// memo(): skip re-rendering when props are shallow-equal.
const MemoSlowList = memo(SlowList);

/**
 * MANUAL: memo + useMemo + useCallback (compiler opted out so this is all hand-written).
 * Typing re-renders the parent, but `items` and `onSelect` keep the same identity,
 * so MemoSlowList bails out. All three pieces are required: drop one and memo breaks.
 */
export function ManualPanel() {
  "use no memo";
  const [text, setText] = useState("");
  const [sort, setSort] = useState<Sort>("asc");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const countRef = useRenderCounter();

  const items = useMemo(() => sortItems(ITEMS, sort), [sort]);
  const onSelect = useCallback((id: number) => setSelectedId(id), []);

  return (
    <>
      <p className="mb-2 text-right"><RenderCount countRef={countRef} label="parent renders" /></p>
      <Controls text={text} onText={setText} sort={sort} onSort={setSort} />
      <MemoSlowList items={items} selectedId={selectedId} onSelect={onSelect} />
    </>
  );
}
