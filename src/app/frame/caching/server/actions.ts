"use server";
import { revalidateTag, updateTag } from "next/cache";
import { sellOne } from "@/lib/caching/inventory";

// Read-your-own-writes: expire the tag now. The page re-render that comes back
// with this action waits for fresh data, so the user sees their change.
export async function sellWithUpdateTag() {
  sellOne(1);
  updateTag("products");
}

// Stale-while-revalidate: just mark the tag stale and return immediately.
// The next visitor gets the OLD value instantly while the cache refreshes
// in the background; the visitor after that gets the new value.
export async function sellWithRevalidateTag() {
  sellOne(1);
  revalidateTag("products", "max");
}
