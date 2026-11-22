"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Product } from "@/lib/db";
import { TimingBadge, useFeedbackTimer } from "@/components/Timing";

export const CATEGORIES = ["Peripherals", "Audio", "Displays", "Networking", "Furniture"];
export type ProductsResponse = { category: string; products: Product[]; servedAt: number };
export type ProductResponse = { product: Product; servedAt: number };

export const productsUrl = (category: string) => `/api/caching/client/products?category=${encodeURIComponent(category)}`;
export const productUrl = (id: number) => `/api/caching/client/products/${id}`;
export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

/**
 * Presentational master/detail UI shared by both panels, so the ONLY difference
 * between them is how data is fetched. Also measures time-to-feedback per click.
 */
export function ProductBrowser(props: {
  category: string;
  onCategory: (c: string) => void;
  productId: number | null;
  onProduct: (id: number) => void;
  list: ProductsResponse | undefined;
  detail: ProductResponse | undefined;
  refreshing?: boolean;
  updatedAt?: number;
  onHoverCategory?: (c: string) => void;
  onHoverProduct?: (id: number) => void;
}) {
  const { category, productId, list, detail } = props;
  const { ms, start, stop } = useFeedbackTimer();
  const listReady = list?.category === category;
  const detailReady = productId === null || detail?.product.id === productId;

  // Stop the timer on the first render where the selected data is on screen.
  useLayoutEffect(() => {
    if (listReady && detailReady) stop();
  }, [listReady, detailReady, category, productId, stop]);

  // How long after page load did real data first appear? (Reload the page to compare.)
  const [firstData, setFirstData] = useState<number | null>(null);
  const recorded = useRef(false);
  useEffect(() => {
    if (!listReady || recorded.current) return;
    recorded.current = true;
    requestAnimationFrame(() => setFirstData(Math.round(performance.now())));
  }, [listReady]);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <TimingBadge ms={ms} label="click → data" />
        <TimingBadge ms={firstData} label="page load → data" />
        {props.refreshing && <span className="animate-pulse text-xs text-muted">↻ refreshing in background…</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { start(); props.onCategory(c); }}
            onMouseEnter={() => props.onHoverCategory?.(c)}
            className={`rounded-full px-2.5 py-1 text-xs ${c === category ? "bg-accent text-white" : "border border-border hover:bg-background"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ul className="min-h-56 space-y-1">
          {listReady ? (
            list.products.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => { start(); props.onProduct(p.id); }}
                  onMouseEnter={() => props.onHoverProduct?.(p.id)}
                  className={`w-full rounded border px-2 py-1 text-left ${p.id === productId ? "border-accent bg-accent/10" : "border-border hover:bg-background"}`}
                >
                  {p.name}
                </button>
              </li>
            ))
          ) : (
            <Spinner />
          )}
        </ul>
        <div className="rounded border border-border p-2">
          {productId === null ? (
            <p className="text-muted">Pick a product</p>
          ) : detailReady ? (
            <div className="space-y-1">
              <div className="font-semibold">{detail!.product.name}</div>
              <div className="text-xs text-muted">{detail!.product.category} · ${detail!.product.price.toFixed(2)} · ★ {detail!.product.rating.toFixed(1)}</div>
              <p className="text-xs">{detail!.product.description}</p>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
      <p className="text-xs text-muted">
        Data fetched at: {props.updatedAt ? new Date(props.updatedAt).toLocaleTimeString() : listReady ? new Date(list.servedAt).toLocaleTimeString() : "—"}
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-24 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}
