import { Compare } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { LatencyScope, MainThreadMeter } from "@/components/perf";
import { DeferredSearch } from "./DeferredSearch";
import { NaiveSearch } from "./NaiveSearch";

export default function TransitionsDemo() {
  return (
    <DemoPage
      slug="transitions"
      tryThis={[
        "Type \"swift otter\" quickly in the Naive box: letters appear in bursts and input latency hits 200ms+.",
        "Type the same in the Instant box: every letter appears immediately; the list dims while it catches up.",
        "Hold Backspace in each to feel the difference, and watch the frame graph.",
      ]}
      takeaways={[
        <>Not all updates are equally urgent. <code>useDeferredValue</code> / <code>startTransition</code> let React paint the urgent one (the keystroke) first.</>,
        "Transition renders are interruptible: a new keystroke abandons the in-progress render instead of queuing behind it.",
        "Show staleness (dim, spinner) so users know the list is catching up.",
        "It doesn't make rendering cheaper: total work is the same or more. If the work is a single long task, use a worker. If the list is huge, virtualize.",
      ]}
    >
      <MainThreadMeter className="sticky top-16 z-[5]" />
      <Compare
        naiveLabel="Naive (every keystroke blocks)"
        instantLabel="useDeferredValue"
        naive={<LatencyScope><NaiveSearch /></LatencyScope>}
        instant={<LatencyScope><DeferredSearch /></LatencyScope>}
      />
    </DemoPage>
  );
}
