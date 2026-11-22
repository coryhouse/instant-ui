import { DemoPage } from "@/components/DemoPage";
import { MainThreadMeter } from "@/components/perf";
import { VirtualizationDemo } from "./VirtualizationDemo";

export default function VirtualizationPage() {
  return (
    <DemoPage
      slug="virtualization"
      tryThis={[
        "Click Mount list on the left: the spinner freezes while ~80,000 DOM nodes are created. Note the mount time.",
        "Click Mount list on the right: it mounts in a few ms with ~150 DOM nodes.",
        "Scroll both. The DOM node count on the right stays flat. Switch to 50,000 rows and repeat.",
      ]}
      takeaways={[
        "The DOM is the slow part: every node costs creation, style, layout, and memory. Render only what's visible.",
        "Virtualization makes cost proportional to the viewport, not the data: 1,000 or 1,000,000 rows mount the same.",
        "Trade-offs: Ctrl+F, anchor links, and screen readers only see rendered rows; variable heights need measuring.",
        <>Don&apos;t bother for a few hundred rows. Try pagination or CSS <code>content-visibility: auto</code> first.</>,
      ]}
    >
      <MainThreadMeter className="sticky top-16 z-[5]" />
      <VirtualizationDemo />
    </DemoPage>
  );
}
