import { Panel } from "@/components/Compare";
import { DemoPage } from "@/components/DemoPage";
import { LatencyScope, MainThreadMeter } from "@/components/perf";
import { CompilerPanel } from "./CompilerPanel";
import { ManualPanel } from "./ManualPanel";
import { NaivePanel } from "./NaivePanel";

export default function MemoDemo() {
  return (
    <DemoPage
      slug="memo"
      tryThis={[
        "Type quickly in the Naive input: characters lag, the spinner stutters, and SlowList's render counter climbs with every keystroke.",
        "Type in Manual and Compiler: the parent counter climbs, but SlowList's counter stays put and typing is instant.",
        "Click Sort or a row in any panel: SlowList must re-render, so all three are equally slow. Memo skips work; it doesn't make work faster.",
      ]}
      takeaways={[
        "Memoization skips re-rendering when inputs haven't changed. It needs stable props: memo + useMemo + useCallback, all or nothing.",
        "The React Compiler does this automatically, at a finer grain than you would by hand. With it enabled, manual memo is mostly obsolete.",
        "Memo doesn't fix a slow component; it only avoids rendering it unnecessarily. Fix the slow part (or virtualize, defer, or move it off the thread).",
        "Measure first (React DevTools Profiler). Memoizing cheap components adds comparison and memory cost for no gain.",
      ]}
    >
      <MainThreadMeter className="sticky top-16 z-[5]" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel tone="naive" label="Naive (no memo)">
          <LatencyScope><NaivePanel /></LatencyScope>
        </Panel>
        <Panel tone="instant" label="Manual memo">
          <LatencyScope><ManualPanel /></LatencyScope>
        </Panel>
        <Panel tone="instant" label="React Compiler">
          <LatencyScope><CompilerPanel /></LatencyScope>
        </Panel>
      </div>
    </DemoPage>
  );
}
