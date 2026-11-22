import "server-only";
import { connection } from "next/server";
import { getProducts } from "@/lib/db";

/** Shared slow payload for the service worker demo endpoints. */
export async function dealsResponse() {
  await connection();
  const products = await getProducts();
  return Response.json(
    { deals: products.slice(0, 4).map((p) => ({ id: p.id, name: p.name, price: p.price })), servedAt: new Date().toISOString() },
    // no-store so the browser's HTTP cache isn't what makes it fast: only the SW cache can.
    { headers: { "Cache-Control": "no-store" } },
  );
}
