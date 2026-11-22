import { Mark } from "@/components/Mark";
import {
  ProductSection, RecsSection, ReviewsSection,
  fetchProduct, fetchRecs, fetchReviews,
} from "../shared";

// Naive: a request waterfall. Each await waits for the previous one even though
// none of them depend on each other: total = product + reviews + recs.
// loading.tsx shows ONE spinner for the whole page until all three are done.
export default async function Page() {
  const product = await fetchProduct();
  const reviews = await fetchReviews();
  const recs = await fetchRecs();
  return (
    <>
      <ProductSection product={product} />
      <Mark name="product" />
      <ReviewsSection reviews={reviews} />
      <Mark name="reviews" />
      <RecsSection products={recs} />
      <Mark name="recs" />
    </>
  );
}
