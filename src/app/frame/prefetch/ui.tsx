import Link from "next/link";
import { getProducts } from "@/lib/db";

export function BackLink({ href }: { href: string }) {
  return <Link href={href} className="mb-3 inline-block text-accent underline">← Back to list</Link>;
}

export function CardSkeleton() {
  return (
    <div className="mb-3 space-y-2 rounded-lg border border-border p-3">
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-5 w-1/5" />
      <div className="skeleton h-16 w-full" />
    </div>
  );
}

/** Product names for the list pages. Cached, so the list itself is static. */
export async function products(ids: number[]) {
  "use cache";
  const all = await getProducts();
  return all.filter((p) => ids.includes(p.id));
}
