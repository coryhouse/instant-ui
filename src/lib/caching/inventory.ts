import "server-only";
import { delay } from "@/lib/server-settings";

/** A tiny mutable "inventory table" for the server-cache demo. */
export type Item = { id: number; name: string; stock: number };

const g = globalThis as typeof globalThis & { __instantUiInventory?: Item[] };
const items = (g.__instantUiInventory ??= [
  { id: 1, name: "Swift Keyboard", stock: 42 },
  { id: 2, name: "Turbo Mouse", stock: 17 },
  { id: 3, name: "Instant Monitor", stock: 8 },
]);

/** Slow read: goes through the latency slider. */
export async function readInventory() {
  await delay();
  return items.map((i) => ({ ...i }));
}

/** Instant read of the "real" current value, for showing when the cache is stale. */
export function peekStock(id: number) {
  return items.find((i) => i.id === id)?.stock ?? 0;
}

export function sellOne(id: number) {
  const item = items.find((i) => i.id === id);
  if (item) item.stock = item.stock > 0 ? item.stock - 1 : 50;
}
