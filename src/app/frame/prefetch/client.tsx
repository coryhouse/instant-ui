"use client";
import Link, { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { ProductDetail } from "./types";

/* ---------- A tiny client-side data cache, filled on hover ---------- */

const cache = new Map<number, Promise<ProductDetail>>();
const settled = new Map<number, ProductDetail>();
let target: number | null = null; // the product the user last clicked

/** Start fetching a product's data (once). Works in dev, unlike Next's route prefetch. */
export function primeProduct(id: number) {
  if (!cache.has(id)) {
    const p = fetch(`/api/prefetch/product/${id}`).then((r) => r.json() as Promise<ProductDetail>);
    p.then((d) => settled.set(id, d));
    cache.set(id, p);
  }
  return cache.get(id)!;
}

/* ---------- Click → visible timer ---------- */

let clickedAt: number | null = null;
let arrivedAfter: number | null = null;

function markClick(id: number) {
  clickedAt = performance.now();
  arrivedAfter = null;
  target = id;
}

/** Shows how long after the click the product details became visible. */
export function Arrived() {
  const [ms, setMs] = useState<number | null>(arrivedAfter);
  useEffect(() => {
    if (arrivedAfter === null && clickedAt !== null) {
      const start = clickedAt;
      requestAnimationFrame(() => setMs((arrivedAfter = Math.round(performance.now() - start))));
    }
  }, []);
  if (ms === null) return null;
  const color = ms < 100 ? "bg-success text-white" : ms < 1000 ? "bg-warning text-white" : "bg-danger text-white";
  return (
    <div className={`mb-3 rounded-lg px-3 py-2 text-center font-mono text-2xl font-bold ${color}`}>
      ⏱ {ms}ms after click
    </div>
  );
}

/* ---------- Link variants ---------- */

function Pending() {
  const { pending } = useLinkStatus();
  return <span className={`ml-auto text-xs text-muted ${pending ? "" : "invisible"}`}>⏳ loading…</span>;
}

const linkClass = "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-medium hover:border-accent";

/** Plain Next <Link>; `prefetch` is passed through (false | true | undefined = App Shell default). */
export function TimedLink({ id, href, prefetch, children }: { id: number; href: string; prefetch?: boolean; children: ReactNode }) {
  return (
    <Link href={href} prefetch={prefetch} onClick={() => markClick(id)} className={linkClass}>
      {children}
      <Pending />
    </Link>
  );
}

/** On hover: prefetch the route (production) AND the data into the client cache (works in dev too). */
export function HoverPrefetchLink({ id, href, children }: { id: number; href: string; children: ReactNode }) {
  const router = useRouter();
  const [primed, setPrimed] = useState(false);
  function onIntent() {
    router.prefetch(href);
    primeProduct(id).then(() => setPrimed(true));
  }
  return (
    <Link href={href} onMouseEnter={onIntent} onFocus={onIntent} onClick={() => markClick(id)} className={linkClass}>
      {children}
      {primed && <span className="rounded bg-success/15 px-1.5 text-xs text-success">data cached</span>}
      <Pending />
    </Link>
  );
}

/* ---------- Destination fallback that uses the hover cache ---------- */

/**
 * Rendered as the <Suspense> fallback on the destination page. If the user
 * hovered first, the data is already in the client cache: show it instantly
 * instead of a skeleton while the server streams the real thing.
 */
export function CachedProductOrSkeleton({ skeleton }: { skeleton: ReactNode }) {
  const id = target;
  const [data, setData] = useState<ProductDetail | null>(id !== null ? settled.get(id) ?? null : null);
  useEffect(() => {
    if (id === null || data || !cache.has(id)) return;
    let live = true;
    cache.get(id)!.then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [id, data]);
  if (!data) return <>{skeleton}</>;
  return (
    <>
      <Arrived />
      <ProductCard product={data} source="client cache (hover prefetch)" />
    </>
  );
}

export function ProductCard({ product, source }: { product: ProductDetail; source: string }) {
  return (
    <section className="mb-3 rounded-lg border border-border bg-surface p-3">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p className="text-muted">{product.description}</p>
      <p className="mt-1 text-lg font-semibold">${product.price.toFixed(2)}</p>
      <ul className="mt-2 space-y-0.5">
        {product.reviews.map((r) => (
          <li key={r.id}>
            <span className="text-warning">{"★".repeat(r.stars)}</span> “{r.body}” — {r.author}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">Source: {source}</p>
    </section>
  );
}
