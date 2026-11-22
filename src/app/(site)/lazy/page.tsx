import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

export default function LazyDemo() {
  return (
    <DemoPage
      slug="lazy"
      tryThis={[
        "Click Reload both and compare the JavaScript and Image bytes before touching anything.",
        "Naive ships the editor + its 1 MB dictionary up front, and downloads the whole gallery nobody can see yet.",
        "In Instant, click Open editor: watch JavaScript jump as the chunk loads on demand. Scroll down: images load as they approach the viewport.",
        "Bytes are measured inside each frame with PerformanceObserver (Resource Timing). Dev bundles are bigger than prod; the difference is what matters.",
      ]}
      takeaways={[
        <>Lazy-load code behind an interaction: <code>next/dynamic(() =&gt; import(&quot;./Editor&quot;))</code> or <code>React.lazy</code> + <code>&lt;Suspense&gt;</code>.</>,
        <>Start the download on intent (hover/focus) so the click still feels instant. Native <code>loading=&quot;lazy&quot;</code> does the same for images and iframes.</>,
        "Less JavaScript up front means faster hydration and a page that responds sooner.",
        "Don't lazy-load what's needed right away (above-the-fold UI, the LCP image): you just add a round trip and a loading flash.",
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/lazy/naive", label: "Eager import + eager images" }}
        instant={{ src: "/frame/lazy/instant", label: "next/dynamic on click + loading=\"lazy\"" }}
        marks={["shell", "interactive"]}
        height={480}
      />
    </DemoPage>
  );
}
