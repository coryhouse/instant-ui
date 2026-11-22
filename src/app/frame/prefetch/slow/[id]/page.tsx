import { connection } from "next/server";
import { Arrived, ProductCard } from "../../client";
import { getProductDetail } from "../../data";
import { BackLink } from "../../ui";

// Naive destination: fully dynamic, no Suspense. Nothing can be prefetched, so
// after the click the old page just sits there until the data arrives.
export const instant = false;

export default async function Page({ params }: PageProps<"/frame/prefetch/slow/[id]">) {
  await connection();
  const product = await getProductDetail(Number((await params).id));
  return (
    <>
      <BackLink href="/frame/prefetch/naive" />
      <Arrived />
      {product && <ProductCard product={product} source="server, fetched after the click" />}
    </>
  );
}
