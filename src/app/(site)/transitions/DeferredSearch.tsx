"use client";
import { useDeferredValue, useState } from "react";
import { SearchInput } from "./NaiveSearch";
import { SlowResults } from "./SlowResults";

/**
 * INSTANT: the input renders with `query` (urgent), the list with a deferred copy.
 * React paints the keystroke first, then renders the list in the background,
 * yielding to new keystrokes and throwing away stale renders.
 * (Deferring only helps if the list can skip re-rendering for an unchanged
 * value: the React Compiler memoizes <SlowResults> for us. Without it: memo().)
 */
export function DeferredSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <div className={`transition-opacity ${isStale ? "opacity-50 delay-100" : ""}`}>
        <SlowResults query={deferredQuery} />
      </div>
    </>
  );
}
