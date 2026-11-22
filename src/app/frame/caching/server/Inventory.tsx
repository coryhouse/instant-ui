import type { Item } from "@/lib/caching/inventory";

export function InventoryList({ items, computedAt }: { items: Item[]; computedAt: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs">
        Computed at <b className="font-mono">{computedAt}</b>
      </p>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between rounded border border-border bg-surface px-2 py-1">
            <span>{i.name}</span>
            <span className="font-mono">{i.stock} in stock</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InventorySkeleton() {
  return (
    <div className="space-y-2">
      <div className="skeleton h-4 w-40" />
      {[0, 1, 2].map((i) => <div key={i} className="skeleton h-8 w-full" />)}
    </div>
  );
}
