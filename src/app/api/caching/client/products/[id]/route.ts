import { connection } from "next/server";
import { getProduct } from "@/lib/db";

// GET /api/caching/client/products/7 — slow detail endpoint (latency slider).
export async function GET(_request: Request, { params }: RouteContext<"/api/caching/client/products/[id]">) {
  await connection();
  const product = await getProduct(Number((await params).id));
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ product, servedAt: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
