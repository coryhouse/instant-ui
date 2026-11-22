import { cookies } from "next/headers";
import { connection } from "next/server";
import { getProduct, getRecommendations, type Product } from "@/lib/db";
import { delay, getSettings } from "@/lib/server-settings";

/* ---------- Data: one static-ish, three per-request ---------- */

export const PRODUCT_ID = 7;

/** Per-user: reads a cookie, so it can never be prerendered. */
export async function getCartCount() {
  const jar = await cookies();
  await delay(getSettings().latency * 0.5);
  return Number(jar.get("cart")?.value ?? 3);
}

/** Live: different on every request. */
export async function getLiveStock() {
  await connection();
  await delay();
  return { inStock: 4 + Math.floor(Math.random() * 20), viewers: 10 + Math.floor(Math.random() * 90) };
}

/** Personalized: the slowest call on the page. */
export async function getPersonalRecs() {
  await connection();
  return getRecommendations(PRODUCT_ID, { latency: getSettings().latency * 1.5 });
}

/* ---------- UI (shared by both versions so only the strategy differs) ---------- */

export function StoreHeader({ cart }: { cart: React.ReactNode }) {
  return (
    <header className="mb-3 flex items-center justify-between rounded-lg bg-accent px-3 py-2 text-white">
      <span className="font-bold">⚡ Snappy Store</span>
      <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">🛒 {cart}</span>
    </header>
  );
}

export function ProductInfo({ product }: { product: Product | null }) {
  if (!product) return null;
  return (
    <section className="mb-3 rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 flex h-20 items-center justify-center rounded bg-gradient-to-br from-accent/40 to-success/30 text-3xl">
        ⌨️
      </div>
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p className="text-muted">{product.description}</p>
      <p className="mt-1 text-lg font-semibold">${product.price.toFixed(2)}</p>
    </section>
  );
}

export function LiveStock({ inStock, viewers }: { inStock: number; viewers: number }) {
  return (
    <p className="mb-3 rounded-lg bg-warning/15 px-3 py-2 font-medium text-warning">
      🔥 {viewers} people viewing · only {inStock} left
    </p>
  );
}

export function LiveStockSkeleton() {
  return <div className="skeleton mb-3 h-10 w-full" />;
}

export function Recs({ products }: { products: Product[] }) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">Recommended for you</h2>
      <ul className="grid grid-cols-2 gap-2">
        {products.map((p) => (
          <li key={p.id} className="rounded-lg border border-border bg-surface p-2">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted">${p.price.toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecsSkeleton() {
  return (
    <section>
      <h2 className="mb-2 font-semibold">Recommended for you</h2>
      <ul className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="space-y-1 rounded-lg border border-border p-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/3" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export { getProduct };
