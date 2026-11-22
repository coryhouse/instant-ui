import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

export default function StaticDemo() {
  return (
    <DemoPage
      slug="static"
      tryThis={[
        "Set latency to 2000ms and click Reload both.",
        "Note the \"Rendered at\" time: the prerendered page doesn't change, the dynamic page does.",
        "For real numbers, run a production build (pnpm build && pnpm start).",
      ]}
      takeaways={[
        "If the output is the same for every user, render it once, not once per request.",
        "Static HTML can be served from a CDN close to the user: no server work, no database.",
        <>With Cache Components, <code>&quot;use cache&quot;</code> makes a page static; uncached data makes it dynamic.</>,
        "Revalidate on a schedule (cacheLife) or on demand (revalidateTag) to keep it fresh.",
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/static/naive", label: "Dynamic SSR (per request)" }}
        instant={{ src: "/frame/static/instant", label: "Static (prerendered)" }}
      />
    </DemoPage>
  );
}
