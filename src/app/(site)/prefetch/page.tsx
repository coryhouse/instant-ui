import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

const hints = `// Resource hints: tell the browser what it'll need soon.
<link rel="preconnect" href="https://api.example.com" />      // DNS + TCP + TLS now
<link rel="preload" href="/hero.avif" as="image" fetchPriority="high" />  // needed for THIS page
<link rel="prefetch" href="/next-page-data.json" />           // maybe needed for the NEXT page

// React 19 (react-dom) does the same from any component:
import { preconnect, preload, prefetchDNS } from "react-dom";
preload("/fonts/inter.woff2", { as: "font", type: "font/woff2" });`;

export default function PrefetchDemo() {
  return (
    <DemoPage
      slug="prefetch"
      tryThis={[
        "Click a product in each frame. The big ⏱ badge shows click → product visible.",
        "Naive: the click seems to do nothing for a full round trip. Instant (any group): the page switches immediately with a skeleton.",
        "Hover a \"Hover prefetch\" link, wait for \"data cached\", then click: 0ms. This one works in dev.",
        <><strong>Next.js doesn&apos;t prefetch in dev.</strong> To see the first two groups at full strength: <code>pnpm build &amp;&amp; pnpm start</code>.</>,
      ]}
      takeaways={[
        <>Users signal intent before they click: viewport, hover (~200–300ms early), pointerdown. Spend that time fetching.</>,
        <>In Next.js, <code>&lt;Link&gt;</code> prefetches the route&apos;s App Shell by default; <code>prefetch=&#123;true&#125;</code> also prefetches the link&apos;s cached data. <code>router.prefetch()</code> lets you trigger it yourself (e.g. on hover).</>,
        <>Not on Next? Speculation Rules (<code>&lt;script type=&quot;speculationrules&quot;&gt;</code>) prefetch or fully prerender plain-link MPA navigations, and <code>preload</code>/<code>preconnect</code> warm up critical resources.</>,
        "Prefetching isn't free: it costs bandwidth and server load. Don't prefetch huge lists eagerly, personalized/expensive pages, or anything with side effects (GET must be safe).",
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/prefetch/naive", label: "<Link prefetch={false}> → blocking page" }}
        instant={{ src: "/frame/prefetch/instant", label: "Prefetch: App Shell, full, and on hover" }}
        marks={[]}
        height={500}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-1 font-semibold">Speculation Rules: instant MPA navigations</h2>
          <p className="mb-3 text-sm text-muted">
            Plain <code>&lt;a&gt;</code> links + a JSON rule, and Chrome prerenders the next page in a hidden tab on hover.
            Prerendering doesn&apos;t work inside iframes, so this opens in a new tab.
          </p>
          <a href="/frame/prefetch/mpa" target="_blank" className="inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Open the Speculation Rules demo ↗
          </a>
        </section>
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-2 font-semibold">Preload & preconnect</h2>
          <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs">{hints}</pre>
        </section>
      </div>
    </DemoPage>
  );
}
