"use client";
import { burn, RenderCount, useRenderCounter } from "@/components/perf";

export type Item = { id: number; name: string };
export type Sort = "asc" | "desc";

const NAMES = ["Ada", "Grace", "Linus", "Margaret", "Dennis", "Barbara", "Ken", "Radia", "Alan", "Frances", "Tim", "Hedy", "Guido", "Katherine", "Brendan", "Annie", "Bjarne", "Jean", "Donald", "Sophie"];
export const ITEMS: Item[] = Array.from({ length: 40 }, (_, i) => ({ id: i, name: `${NAMES[i % NAMES.length]} #${i + 1}` }));

export function sortItems(items: Item[], sort: Sort) {
  return [...items].sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));
}

export const MS_PER_ROW = 2.5;

/**
 * A deliberately slow component: every row burns 2.5ms, so one render of
 * 40 rows costs ~100ms. Shared by all three panels.
 * "use no memo" keeps the React Compiler from caching the burn() calls,
 * so the component itself stays slow no matter who renders it.
 */
export function SlowList({ items, selectedId, onSelect }: { items: Item[]; selectedId: number | null; onSelect: (id: number) => void }) {
  "use no memo";
  const countRef = useRenderCounter();
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>SlowList ({items.length} rows × {MS_PER_ROW}ms)</span>
        <RenderCount countRef={countRef} />
      </div>
      <ul className="h-64 overflow-y-auto rounded-md border border-border text-sm">
        {items.map((item) => {
          burn(MS_PER_ROW);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full px-3 py-1 text-left hover:bg-muted/10 ${item.id === selectedId ? "bg-accent/15 font-semibold" : ""}`}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
