import { getProducts } from "@/lib/db";
import { MpaLink } from "./MpaTimer";

// Speculation Rules: a browser API (Chromium) that prefetches or fully
// prerenders likely next pages for ordinary <a> links: no framework needed.
// "moderate" eagerness = start after ~200ms of hover (or on pointerdown).
const rules = {
  prerender: [{ where: { selector_matches: ".speculate" }, eagerness: "moderate" }],
};

export default async function Page() {
  "use cache";
  const products = (await getProducts()).slice(20, 26);
  const link = "block rounded-lg border border-border bg-surface px-3 py-2 font-medium hover:border-accent";
  return (
    <div className="mx-auto max-w-3xl">
      <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }} />
      <h1 className="text-2xl font-bold">Speculation Rules (MPA)</h1>
      <p className="mb-4 text-muted">
        Plain <code>&lt;a&gt;</code> links, full page loads, slow server pages. Hover a right-hand link for a moment, then click.
        Chrome/Edge only. Check DevTools → Application → Speculative loads.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <section>
          <h2 className="mb-2 font-semibold text-danger">🐢 Plain links</h2>
          <div className="space-y-2">
            {products.slice(0, 3).map((p) => (
              <MpaLink key={p.id} href={`/frame/prefetch/mpa/${p.id}`} className={link}>{p.name}</MpaLink>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-2 font-semibold text-success">⚡ Prerendered on hover</h2>
          <div className="space-y-2">
            {products.slice(3).map((p) => (
              <MpaLink key={p.id} href={`/frame/prefetch/mpa/${p.id}`} className={`${link} speculate`}>{p.name}</MpaLink>
            ))}
          </div>
        </section>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-surface p-3 text-xs">{`<script type="speculationrules">\n${JSON.stringify(rules, null, 2)}\n</script>`}</pre>
    </div>
  );
}
