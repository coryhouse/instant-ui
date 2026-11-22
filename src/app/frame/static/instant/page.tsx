import { cacheLife } from "next/cache";
import { Mark } from "@/components/Mark";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProducts } from "@/lib/db";

// Instant: the whole page is cached, so it's rendered once at build time and
// served as static HTML. The slow query never runs on the request path.
export default async function Page() {
  "use cache";
  cacheLife("days");
  const products = await getProducts();
  return (
    <>
      <Mark name="shell" />
      <h1 className="mb-2 text-lg font-semibold">Catalog (prerendered)</h1>
      <p className="mb-3 text-xs text-muted">Rendered at {new Date().toLocaleTimeString()}</p>
      <ProductGrid products={products.slice(0, 12)} />
      <Mark name="content" />
    </>
  );
}
