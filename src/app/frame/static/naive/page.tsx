import { connection } from "next/server";
import { Mark } from "@/components/Mark";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProducts } from "@/lib/db";

// Naive: render on every request. The user stares at a blank page until the
// "database" responds, even though this catalog rarely changes.
export const instant = false;

export default async function Page() {
  await connection();
  const products = await getProducts();
  return (
    <>
      <Mark name="shell" />
      <h1 className="mb-2 text-lg font-semibold">Catalog (rendered per request)</h1>
      <p className="mb-3 text-xs text-muted">Rendered at {new Date().toLocaleTimeString()}</p>
      <ProductGrid products={products.slice(0, 12)} />
      <Mark name="content" />
    </>
  );
}
