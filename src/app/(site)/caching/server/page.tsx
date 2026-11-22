import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

export default function ServerCacheDemo() {
  return (
    <DemoPage
      slug="caching/server"
      tryThis={[
        "Click Reload both a few times. Naive shows a skeleton for the full latency every time; the cached side is instant and its \"Computed at\" doesn't change.",
        "Click \"Sell 1 → updateTag\": the action waits for fresh data, then shows the new stock (read-your-own-writes) and a new \"Computed at\".",
        "Click \"Sell 1 → revalidateTag(\"max\")\": returns instantly, nothing re-renders. Click \"Reload this frame\": instant, but the cached stock is OLD (compare \"Database right now\"). Reload again after the latency: fresh (it refreshed in the background).",
      ]}
      takeaways={[
        <><code>&quot;use cache&quot;</code> caches a function or component&apos;s output across requests: pay for the slow query once, not per visitor.</>,
        <><code>cacheTag</code> names the entry; invalidate it precisely after a mutation instead of guessing with timers. <code>cacheLife</code> is the safety net.</>,
        <><code>updateTag</code> (Server Actions only): the user who made the change sees it immediately. <code>revalidateTag(tag, &quot;max&quot;)</code>: everyone gets stale data instantly while it refreshes.</>,
        "Don't cache per-user or must-be-exact data (balances, permissions) in a shared cache. Pass user-specific values as arguments or keep it dynamic.",
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/caching/server/naive", label: "Query on every request" }}
        instant={{ src: "/frame/caching/server/instant", label: "\"use cache\" + cacheTag" }}
        height={340}
      />
    </DemoPage>
  );
}
