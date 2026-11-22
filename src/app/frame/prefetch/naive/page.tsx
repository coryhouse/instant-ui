import { TimedLink } from "../client";
import { products } from "../ui";

// Naive: prefetch disabled. Nothing starts until the click, and the destination
// blocks on its data, so every navigation costs a full round trip + query.
export default async function Page() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Products</h1>
      <p className="mb-3 text-muted">{"<Link prefetch={false}>"} → fully dynamic page</p>
      <div className="space-y-2">
        {(await products([10, 11, 12, 13, 14])).map((p) => (
          <TimedLink key={p.id} id={p.id} href={`/frame/prefetch/slow/${p.id}`} prefetch={false}>
            {p.name}
          </TimedLink>
        ))}
      </div>
    </>
  );
}
