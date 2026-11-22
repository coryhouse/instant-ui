"use client";
import { burn } from "@/components/perf";
import { MS_PER_ROW, search } from "./data";

/** Up to 250 rows, each a separate component that burns ~0.8ms (~200ms per render). */
export function SlowResults({ query }: { query: string }) {
  const { total, rows } = search(query);
  return (
    <div>
      <p className="mb-1 text-xs text-muted">
        {total.toLocaleString()} matches{total > rows.length ? ` (showing ${rows.length})` : ""}
      </p>
      <ul className="h-72 overflow-y-auto rounded-md border border-border text-sm">
        {rows.map((word) => (
          <SlowRow key={word} word={word} query={query} />
        ))}
      </ul>
    </div>
  );
}

// Separate components matter: React can only pause *between* components.
function SlowRow({ word, query }: { word: string; query: string }) {
  "use no memo"; // keep the compiler from caching the expensive part
  burn(MS_PER_ROW);
  return <li className="px-3 py-0.5">{highlight(word, query)}</li>;
}

function highlight(word: string, query: string) {
  const i = query ? word.toLowerCase().indexOf(query.trim().toLowerCase()) : -1;
  if (i < 0) return word;
  const end = i + query.trim().length;
  return (
    <>
      {word.slice(0, i)}
      <mark className="rounded bg-warning/30 text-inherit">{word.slice(i, end)}</mark>
      {word.slice(end)}
    </>
  );
}
