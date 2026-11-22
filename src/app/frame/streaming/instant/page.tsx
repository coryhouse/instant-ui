import { Suspense } from "react";
import { Mark } from "@/components/Mark";
import {
  ProductSection, ProductSkeleton, RecsSection, RecsSkeleton, ReviewsSection, ReviewsSkeleton,
  fetchProduct, fetchRecs, fetchReviews,
} from "../shared";

// Instant: start all three queries at once (no await), then give each section
// its own <Suspense> boundary. Total = the slowest query, and each section
// appears the moment its own data is ready.
export default function Page() {
  const product = fetchProduct();
  const reviews = fetchReviews();
  const recs = fetchRecs();
  return (
    <>
      <Suspense fallback={<ProductSkeleton />}>
        <Product data={product} />
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews data={reviews} />
      </Suspense>
      <Suspense fallback={<RecsSkeleton />}>
        <Recs data={recs} />
      </Suspense>
    </>
  );
}

async function Product({ data }: { data: ReturnType<typeof fetchProduct> }) {
  return <><ProductSection product={await data} /><Mark name="product" /></>;
}

async function Reviews({ data }: { data: ReturnType<typeof fetchReviews> }) {
  return <><ReviewsSection reviews={await data} /><Mark name="reviews" /></>;
}

async function Recs({ data }: { data: ReturnType<typeof fetchRecs> }) {
  return <><RecsSection products={await data} /><Mark name="recs" /></>;
}
