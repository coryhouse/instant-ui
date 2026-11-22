import { DemoPage } from "@/components/DemoPage";
import { MainThreadMeter } from "@/components/perf";
import { WorkersDemo } from "./WorkersDemo";

export default function WorkersPage() {
  return (
    <DemoPage
      slug="workers"
      tryThis={[
        "Click Count primes on the left, then immediately try typing or clicking +1: the spinner and FPS freeze, nothing responds, then everything lands at once.",
        "Do the same on the right: the spinner keeps spinning at 60fps and you can type the whole time.",
        "Compare the durations: the worker isn't faster. It just isn't in the way.",
      ]}
      takeaways={[
        "JavaScript on the main thread competes with rendering and input. A 3s task means a 3s frozen page (and a terrible INP).",
        <>A Web Worker runs code on another thread. <code>new Worker(new URL(&quot;./x.worker.ts&quot;, import.meta.url))</code> works in Next.js out of the box.</>,
        "Workers can't touch the DOM or React state; communicate with postMessage (data is copied, so keep payloads small or use transferables).",
        "Not for small tasks: startup and message copying cost a few ms. Use them for parsing, image processing, crypto, search indexing, big sorts.",
      ]}
    >
      <MainThreadMeter className="sticky top-16 z-[5]" />
      <WorkersDemo />
    </DemoPage>
  );
}
