import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { Mark } from "@/components/Mark";
import {
  LiveStock, LiveStockSkeleton, PRODUCT_ID, ProductInfo, Recs, RecsSkeleton, StoreHeader,
  getCartCount, getLiveStock, getPersonalRecs, getProduct,
} from "../shared";

// Instant (PPR): the header and product info are cached, so they're baked into a
// static shell that's sent immediately. Per-request parts stream into <Suspense> holes.
export default function Page() {
  return (
    <>
      <StoreHeader cart={<Suspense fallback={<span className="skeleton inline-block h-4 w-4" />}><Cart /></Suspense>} />
      <CachedProductInfo />
      <Mark name="shell" />
      <Suspense fallback={<LiveStockSkeleton />}>
        <Stock />
      </Suspense>
      <Suspense fallback={<RecsSkeleton />}>
        <PersonalRecs />
      </Suspense>
    </>
  );
}

// Static: same for everyone → prerendered into the shell.
async function CachedProductInfo() {
  "use cache";
  cacheLife("hours");
  return <ProductInfo product={await getProduct(PRODUCT_ID)} />;
}

// Dynamic holes: each streams in on its own as soon as its data is ready.
async function Cart() {
  return <>{await getCartCount()}</>;
}

async function Stock() {
  return <LiveStock {...await getLiveStock()} />;
}

async function PersonalRecs() {
  const recs = await getPersonalRecs();
  return (
    <>
      <Recs products={recs} />
      <Mark name="content" />
    </>
  );
}
