import { connection } from "next/server";
import { getProducts } from "@/lib/db";

// GET /api/caching/client/products?category=Audio — slow list endpoint (latency slider).
export async function GET(request: Request) {
  await connection();
  const category = new URL(request.url).searchParams.get("category");
  const products = (await getProducts()).filter((p) => !category || p.category === category);
  return Response.json({ category, products: products.slice(0, 6), servedAt: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
