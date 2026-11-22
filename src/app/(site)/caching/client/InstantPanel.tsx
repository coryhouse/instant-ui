"use client";
import { useState } from "react";
import { QueryClient, queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { getJson, ProductBrowser, productUrl, productsUrl, type ProductResponse, type ProductsResponse } from "./ProductBrowser";

const PERSIST_KEY = "instant-ui:caching-client";
const DAY = 1000 * 60 * 60 * 24;

// Instant: every response is cached by key. Revisits render cached data immediately
// while TanStack Query refetches in the background (stale-while-revalidate).
const productsQuery = (category: string) =>
  queryOptions({ queryKey: ["products", category], queryFn: () => getJson<ProductsResponse>(productsUrl(category)) });
const productQuery = (id: number) =>
  queryOptions({ queryKey: ["product", id], queryFn: () => getJson<ProductResponse>(productUrl(id)) });

/** Provider lives here (not the root layout) so the cache only exists for this demo. */
export function InstantPanel() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { gcTime: DAY } } }));
  // Persist the cache to localStorage so a full page reload shows data immediately.
  const [persister] = useState(() =>
    createSyncStoragePersister({ storage: typeof window === "undefined" ? undefined : window.localStorage, key: PERSIST_KEY }),
  );
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: DAY }}>
      <Browser onClear={() => { queryClient.clear(); persister.removeClient(); }} />
    </PersistQueryClientProvider>
  );
}

const STALE_TIMES = [
  { label: "0 (always revalidate)", ms: 0 },
  { label: "10s", ms: 10_000 },
  { label: "∞", ms: Infinity },
];

function Browser({ onClear }: { onClear: () => void }) {
  const queryClient = useQueryClient();
  const [staleTime, setStaleTime] = useState(0);
  const [category, setCategory] = useState("Peripherals");
  const [productId, setProductId] = useState<number | null>(null);
  const list = useQuery({ ...productsQuery(category), staleTime });
  const detail = useQuery({ ...productQuery(productId ?? 0), enabled: productId !== null, staleTime });

  return (
    <div className="space-y-3">
      <ProductBrowser
        category={category}
        onCategory={(c) => { setCategory(c); setProductId(null); }}
        productId={productId}
        onProduct={setProductId}
        list={list.data}
        detail={detail.data}
        refreshing={(list.isFetching && !!list.data) || (detail.isFetching && !!detail.data)}
        updatedAt={list.dataUpdatedAt || undefined}
        // Prefetch on hover: by the time the click lands, the data is often already here.
        onHoverCategory={(c) => queryClient.prefetchQuery({ ...productsQuery(c), staleTime })}
        onHoverProduct={(id) => queryClient.prefetchQuery({ ...productQuery(id), staleTime })}
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2 text-xs">
        <span className="text-muted">staleTime:</span>
        {STALE_TIMES.map((s) => (
          <button
            key={s.label}
            onClick={() => setStaleTime(s.ms)}
            className={`rounded px-2 py-0.5 ${staleTime === s.ms ? "bg-accent text-white" : "border border-border"}`}
          >
            {s.label}
          </button>
        ))}
        <button onClick={onClear} className="ml-auto rounded border border-border px-2 py-0.5 hover:bg-background">
          Clear cache
        </button>
      </div>
    </div>
  );
}
