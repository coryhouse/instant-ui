"use client";
import { useState } from "react";
import { RenderCount, useRenderCounter } from "@/components/perf";
import { Controls } from "./Controls";
import { ITEMS, SlowList, sortItems, type Sort } from "./SlowList";

/**
 * NAIVE: no memoization (compiler opted out with "use no memo").
 * Every keystroke re-renders the parent, which creates a new `items` array
 * and a new `onSelect` function, and re-renders SlowList (~100ms). Typing lags.
 */
export function NaivePanel() {
  "use no memo";
  const [text, setText] = useState("");
  const [sort, setSort] = useState<Sort>("asc");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const countRef = useRenderCounter();

  const items = sortItems(ITEMS, sort); // new array every render
  const onSelect = (id: number) => setSelectedId(id); // new function every render

  return (
    <>
      <p className="mb-2 text-right"><RenderCount countRef={countRef} label="parent renders" /></p>
      <Controls text={text} onText={setText} sort={sort} onSort={setSort} />
      <SlowList items={items} selectedId={selectedId} onSelect={onSelect} />
    </>
  );
}
