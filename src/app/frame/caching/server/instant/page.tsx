import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { Mark } from "@/components/Mark";
import { peekStock, readInventory } from "@/lib/caching/inventory";
import { sellWithRevalidateTag, sellWithUpdateTag } from "../actions";
import { InventoryList, InventorySkeleton } from "../Inventory";

// Instant: the slow query runs once, then its output is reused across requests
// until it's invalidated by tag (or cacheLife expires it).
async function getInventory() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const items = await readInventory();
  return { items, computedAt: new Date().toLocaleTimeString() };
}

async function Inventory() {
  const { items, computedAt } = await getInventory();
  return <InventoryList items={items} computedAt={computedAt} />;
}

// Uncached and fast (no delay): shows the real DB value so stale cache data is obvious.
async function LiveStock() {
  await connection();
  return <>Database right now: Swift Keyboard has <b className="font-mono">{peekStock(1)}</b> in stock</>;
}

export default function Page() {
  return (
    <>
      <Mark name="shell" />
      <h1 className="mb-1 text-lg font-semibold">Inventory (&quot;use cache&quot;)</h1>
      <p className="mb-3 text-xs text-muted">
        <code>cacheTag(&quot;products&quot;)</code> · <code>cacheLife(&quot;hours&quot;)</code>
      </p>
      <Suspense fallback={<InventorySkeleton />}>
        <Inventory />
        <Mark name="content" />
      </Suspense>
      <p className="mt-2 text-xs text-muted">
        <Suspense fallback="Database right now: …"><LiveStock /></Suspense>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <form action={sellWithUpdateTag}>
          <button className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Sell 1 keyboard → updateTag</button>
        </form>
        <form action={sellWithRevalidateTag}>
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface">Sell 1 keyboard → revalidateTag(&quot;max&quot;)</button>
        </form>
      </div>
      <a href="/frame/caching/server/instant" className="mt-3 inline-block text-xs underline">↻ Reload this frame</a>
    </>
  );
}
