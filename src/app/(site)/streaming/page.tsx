import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";
import { Waterfall } from "./Waterfall";

export default function StreamingDemo() {
  return (
    <DemoPage
      slug="streaming"
      tryThis={[
        "Set latency to 2000ms and click Reload both.",
        "Naive: one spinner (loading.tsx), then everything at once at ~3× latency. Instant: skeletons, then each section pops in on its own.",
        "Compare the recs badges: sum of all queries vs the slowest one.",
        "Drag the latency slider and watch the expected timeline below update.",
      ]}
      takeaways={[
        <>Independent data? Don&apos;t <code>await</code> it one by one. Start every request first, await later (or pass the promises down).</>,
        <>One <code>&lt;Suspense&gt;</code> per independent section lets each reveal as soon as it&apos;s ready. <code>loading.tsx</code> is just a page-level Suspense boundary.</>,
        "Total time drops from the sum of the queries to the slowest one.",
        "Don't over-split: too many boundaries make the page pop around. Group things that should appear together, and keep true dependencies sequential.",
      ]}
    >
      <Waterfall />
      <FrameCompare
        naive={{ src: "/frame/streaming/naive", label: "Waterfall + one loading.tsx spinner" }}
        instant={{ src: "/frame/streaming/instant", label: "Parallel fetches + Suspense per section" }}
        marks={["product", "reviews", "recs"]}
        height={460}
      />
    </DemoPage>
  );
}
