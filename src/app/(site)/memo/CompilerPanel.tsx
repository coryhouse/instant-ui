"use client";
import { useState } from "react";
import { RenderCount, useRenderCounter } from "@/components/perf";
import { Controls } from "./Controls";
import { ITEMS, SlowList, sortItems, type Sort } from "./SlowList";

/**
 * REACT COMPILER: the exact same code as the naive panel, minus "use no memo".
 * The compiler (reactCompiler: true in next.config.ts) caches `items`, `onSelect`
 * and the <SlowList> element automatically, so typing skips SlowList.
 */
export function CompilerPanel() {
  const [text, setText] = useState("");
  const [sort, setSort] = useState<Sort>("asc");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const countRef = useRenderCounter();

  const items = sortItems(ITEMS, sort);
  const onSelect = (id: number) => setSelectedId(id);

  return (
    <>
      <p className="mb-2 text-right"><RenderCount countRef={countRef} label="parent renders" /></p>
      <Controls text={text} onText={setText} sort={sort} onSort={setSort} />
      <SlowList items={items} selectedId={selectedId} onSelect={onSelect} />
    </>
  );
}
