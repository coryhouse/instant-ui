import { connection } from "next/server";
import { ProductCard } from "../../client";
import { getProductDetail } from "../../data";
import { MpaArrived } from "../MpaTimer";

// A slow, fully dynamic page (like a classic server-rendered MPA page).
export const instant = false;

export default async function Page({ params }: PageProps<"/frame/prefetch/mpa/[id]">) {
  await connection();
  const product = await getProductDetail(Number((await params).id));
  return (
    <div className="mx-auto max-w-xl">
      {/* A plain <a> on purpose: this demo is about full-page (MPA) navigations. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/frame/prefetch/mpa" className="mb-3 inline-block text-accent underline">← Back (full page load)</a>
      <MpaArrived />
      {product && <ProductCard product={product} source="server, full page load" />}
    </div>
  );
}
