import { Compare, Panel } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { EndpointTester, ResetStats } from "./EndpointTester";

export default function HttpCacheDemo() {
  return (
    <DemoPage
      slug="caching/http"
      tryThis={[
        "Click each button a few times. no-store pays the full latency every time; max-age is ~0ms after the first click and the server counter stops moving.",
        "Wait 10s, click max-age again: still instant (stale-while-revalidate), but the server counter goes up — the refresh happened in the background.",
        "Try the ETag panel: the browser still makes a round trip, but the server answers 304 with no body and skips the slow work.",
        "Make sure DevTools \"Disable cache\" is OFF. Open the Network tab to see \"(disk cache)\" / \"(memory cache)\".",
      ]}
      takeaways={[
        "The fastest request is the one you never send: max-age lets the browser skip the network entirely.",
        <>On a CDN, <code>s-maxage</code> does the same for every user at the edge: one origin hit serves thousands. Add <code>stale-while-revalidate</code> so nobody waits for a refresh.</>,
        <><code>ETag</code> + <code>no-cache</code> still costs a round trip, but saves bandwidth and server work when nothing changed.</>,
        <>Don&apos;t cache personalized or rapidly changing data publicly: use <code>private</code> or <code>no-store</code>. You can&apos;t un-send a max-age.</>,
      ]}
    >
      <div className="flex justify-end"><ResetStats /></div>
      <Compare
        naiveLabel="No caching"
        instantLabel="max-age + stale-while-revalidate"
        naive={<EndpointTester endpoint="no-store" header="no-store" />}
        instant={<EndpointTester endpoint="max-age" header="public, max-age=10, stale-while-revalidate=60" />}
      />
      <Panel tone="instant" label="Bonus: revalidate with ETag / 304">
        <EndpointTester endpoint="etag" header={`no-cache  +  ETag: "deals-v1"`} />
      </Panel>
    </DemoPage>
  );
}
