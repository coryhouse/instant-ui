import "server-only";
import { getProduct, getReviews } from "@/lib/db";
import type { ProductDetail } from "./types";

/** Product + reviews, fetched in parallel. Costs one latency. */
export async function getProductDetail(id: number): Promise<ProductDetail | null> {
  const [product, reviews] = await Promise.all([getProduct(id), getReviews(id)]);
  return product ? { ...product, reviews } : null;
}
