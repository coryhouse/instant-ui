import { getProduct, getRecommendations, getReviews, type Product, type Review } from "@/lib/db";
import { getSettings } from "@/lib/server-settings";

/* Three independent queries with different speeds (fractions of the latency slider). */
export const PRODUCT_ID = 12;
export const fetchProduct = () => getProduct(PRODUCT_ID, { latency: getSettings().latency * 0.6 });
export const fetchReviews = () => getReviews(PRODUCT_ID, { latency: getSettings().latency * 1.0 });
export const fetchRecs = () => getRecommendations(PRODUCT_ID, { latency: getSettings().latency * 1.4 });

export function ProductSection({ product }: { product: Product | null }) {
  if (!product) return null;
  return (
    <section className="mb-3 rounded-lg border border-border bg-surface p-3">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p className="text-muted">{product.description}</p>
      <p className="mt-1 text-lg font-semibold">${product.price.toFixed(2)}</p>
    </section>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="mb-3">
      <h2 className="mb-1 font-semibold">Reviews</h2>
      <ul className="space-y-1">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-border bg-surface px-2 py-1">
            <span className="text-warning">{"★".repeat(r.stars)}</span> “{r.body}” — {r.author}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecsSection({ products }: { products: Product[] }) {
  return (
    <section>
      <h2 className="mb-1 font-semibold">You might also like</h2>
      <ul className="grid grid-cols-2 gap-2">
        {products.map((p) => (
          <li key={p.id} className="rounded-lg border border-border bg-surface p-2 font-medium">{p.name}</li>
        ))}
      </ul>
    </section>
  );
}

export function ProductSkeleton() {
  return (
    <div className="mb-3 space-y-2 rounded-lg border border-border p-3">
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-5 w-1/5" />
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="mb-3 space-y-1">
      <h2 className="mb-1 font-semibold">Reviews</h2>
      {[0, 1, 2].map((i) => <div key={i} className="skeleton h-8 w-full" />)}
    </div>
  );
}

export function RecsSkeleton() {
  return (
    <div>
      <h2 className="mb-1 font-semibold">You might also like</h2>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-10" />)}
      </div>
    </div>
  );
}
