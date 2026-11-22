import { HoverPrefetchLink, TimedLink } from "../client";
import { products } from "../ui";

// Instant: three ways to start the work before the click.
export default async function Page() {
  return (
    <>
      <h1 className="mb-3 text-xl font-bold">Products</h1>

      <Group title="<Link> (default)" note="Prefetches the route's App Shell when visible (production only)">
        {(await products([1, 2])).map((p) => (
          <TimedLink key={p.id} id={p.id} href={`/frame/prefetch/p/${p.id}`}>{p.name}</TimedLink>
        ))}
      </Group>

      <Group title="<Link prefetch={true}>" note="Also prefetches this link's cached data (production only)">
        {(await products([3, 4])).map((p) => (
          <TimedLink key={p.id} id={p.id} href={`/frame/prefetch/p/${p.id}`} prefetch>{p.name}</TimedLink>
        ))}
      </Group>

      <Group title="Hover prefetch" note="onMouseEnter: router.prefetch() + fetch data into a client cache (works in dev)">
        {(await products([5, 6])).map((p) => (
          <HoverPrefetchLink key={p.id} id={p.id} href={`/frame/prefetch/p/${p.id}`}>{p.name}</HoverPrefetchLink>
        ))}
      </Group>
    </>
  );
}

function Group({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="mb-3">
      <h2 className="font-mono font-semibold">{title}</h2>
      <p className="mb-1 text-xs text-muted">{note}</p>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
