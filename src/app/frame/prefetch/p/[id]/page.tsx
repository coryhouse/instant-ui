import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { delay } from "@/lib/server-settings";
import { Arrived, CachedProductOrSkeleton, ProductCard } from "../../client";
import { getProductDetail } from "../../data";
import { BackLink, CardSkeleton } from "../../ui";

// Instant destination: a static App Shell (back link + skeletons) that <Link>
// can prefetch, cached product data that prefetch={true} can include, and a
// live "stock" hole that always streams in after navigation.
export default function Page({ params }: PageProps<"/frame/prefetch/p/[id]">) {
  return (
    <>
      <BackLink href="/frame/prefetch/instant" />
      <Suspense fallback={<CachedProductOrSkeleton skeleton={<CardSkeleton />} />}>
        <Product params={params} />
      </Suspense>
      <Suspense fallback={<div className="skeleton h-9 w-full" />}>
        <LiveStock />
      </Suspense>
    </>
  );
}

async function getCachedProduct(id: number) {
  "use cache";
  cacheLife("minutes");
  return getProductDetail(id);
}

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const product = await getCachedProduct(Number((await params).id));
  if (!product) return null;
  return (
    <>
      <Arrived />
      <ProductCard product={product} source="server (use cache)" />
    </>
  );
}

async function getStock() {
  await connection();
  await delay();
  return 3 + Math.floor(Math.random() * 9);
}

async function LiveStock() {
  const stock = await getStock();
  return (
    <p className="rounded-lg bg-warning/15 px-3 py-2 font-medium text-warning">
      🔥 Only {stock} left (live, never prefetched)
    </p>
  );
}
