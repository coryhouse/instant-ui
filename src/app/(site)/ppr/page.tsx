import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

export default function PprDemo() {
  return (
    <DemoPage
      slug="ppr"
      tryThis={[
        "Set latency to 2000ms and click Reload both.",
        "Naive: blank until everything arrives (~3s). Instant: header + product appear immediately, then stock, then recommendations.",
        "Compare the shell badges: the instant shell doesn't depend on latency at all.",
        "For real numbers, run a production build (pnpm build && pnpm start): the shell is served as static HTML.",
      ]}
      takeaways={[
        "Most pages are mostly static. Don't make the static 90% wait for the dynamic 10%.",
        <>With Cache Components, PPR is the default: cached content (<code>&quot;use cache&quot;</code>) goes in the static shell, uncached data inside <code>&lt;Suspense&gt;</code> becomes a streamed hole.</>,
        "One request, one response: the shell flushes first, the holes stream in on the same connection.",
        "Skeletons should match the final layout. If the dynamic part IS the page (e.g. a search results page), a shell buys little.",
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/ppr/naive", label: "Fully dynamic (blocks on slowest query)" }}
        instant={{ src: "/frame/ppr/instant", label: "Partial prerendering (static shell + holes)" }}
        marks={["shell", "content"]}
        height={480}
      />
    </DemoPage>
  );
}
