import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { InstantPanel } from "./InstantPanel";
import { NaivePanel } from "./NaivePanel";

export default function ClientCacheDemo() {
  return (
    <DemoPage
      slug="caching/client"
      tryThis={[
        "Click through a few categories and products on both sides, then go back to one you've seen. Naive spins every time; cached is instant (~16ms) while \"refreshing…\" shows the background revalidation.",
        "Hover a category or product on the right for a moment before clicking: prefetch means even the first visit is instant.",
        "Reload the whole page: \"page load → data\" on the right is near-instant because the cache was persisted to localStorage.",
        "Set staleTime to 10s: revisits inside 10s don't refetch at all. Use Clear cache to reset.",
      ]}
      takeaways={[
        "Stale-while-revalidate: show what you have now, fetch what's new in the background. Most data is fine being a few seconds old.",
        <><code>staleTime</code> controls how often you refetch; prefetch on hover/intent hides the first request too.</>,
        "Persisting the cache makes return visits instant, even after a full reload.",
        "Not for data that must be exact (stock levels at checkout, balances): show a fresh fetch or confirm on the server. And invalidate after mutations.",
      ]}
    >
      <Compare
        naiveLabel="useEffect + fetch"
        instantLabel="TanStack Query (cached, SWR, prefetch, persisted)"
        naive={<NaivePanel />}
        instant={<InstantPanel />}
      />
    </DemoPage>
  );
}
