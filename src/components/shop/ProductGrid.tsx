import type { Product } from "@/lib/db";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {products.map((p) => (
        <li key={p.id} className="rounded-lg border border-border bg-surface p-2">
          <div className="font-medium">{p.name}</div>
          <div className="text-xs text-muted">{p.category} · ${p.price.toFixed(2)}</div>
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="space-y-1 rounded-lg border border-border p-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </li>
      ))}
    </ul>
  );
}
