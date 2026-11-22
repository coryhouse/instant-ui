import { connection } from "next/server";
import { Mark } from "@/components/Mark";
import {
  LiveStock, PRODUCT_ID, ProductInfo, Recs, StoreHeader,
  getCartCount, getLiveStock, getPersonalRecs, getProduct,
} from "../shared";

// Naive: the whole page is dynamic. Even the parts that are the same for everyone
// (header, product info) wait for the slowest per-user query. Blank screen until then.
export const instant = false;

export default async function Page() {
  await connection();
  const [product, cart, stock, recs] = await Promise.all([
    getProduct(PRODUCT_ID),
    getCartCount(),
    getLiveStock(),
    getPersonalRecs(),
  ]);
  return (
    <>
      <Mark name="shell" />
      <StoreHeader cart={cart} />
      <ProductInfo product={product} />
      <LiveStock {...stock} />
      <Recs products={recs} />
      <Mark name="content" />
    </>
  );
}
