import { Suspense } from "react";
import { connection } from "next/server";
import { Mark } from "@/components/Mark";
import { readInventory } from "@/lib/caching/inventory";
import { InventoryList, InventorySkeleton } from "../Inventory";

// Naive: query the slow database on EVERY request. The shell streams fast,
// but the user sees a skeleton for the full latency every single time.
async function Inventory() {
  await connection();
  const items = await readInventory();
  return <InventoryList items={items} computedAt={new Date().toLocaleTimeString()} />;
}

export default function Page() {
  return (
    <>
      <Mark name="shell" />
      <h1 className="mb-1 text-lg font-semibold">Inventory (uncached)</h1>
      <p className="mb-3 text-xs text-muted">Hits the database on every request.</p>
      <Suspense fallback={<InventorySkeleton />}>
        <Inventory />
        <Mark name="content" />
      </Suspense>
      <a href="/frame/caching/server/naive" className="mt-3 inline-block text-xs underline">↻ Reload this frame</a>
    </>
  );
}
