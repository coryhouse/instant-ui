import { getProductDetail } from "@/app/frame/prefetch/data";

/** JSON for the hover-prefetch client cache. Slow on purpose (latency slider). */
export async function GET(_request: Request, ctx: RouteContext<"/api/prefetch/product/[id]">) {
  const { id } = await ctx.params;
  const product = await getProductDetail(Number(id));
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(product, { headers: { "cache-control": "no-store" } });
}
