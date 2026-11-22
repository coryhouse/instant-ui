import { DemoPage } from "@/components/DemoPage";
import { FrameCompare } from "@/components/FrameCompare";

export default function ImagesDemo() {
  return (
    <DemoPage
      slug="images"
      tryThis={[
        "Click Reload both. Both frames get the same simulated ~40 Mbps connection.",
        "Naive: ~15 MB of PNGs, the heading jumps down as each image arrives (CLS), and the hero fights the gallery for bandwidth (slow LCP).",
        "Instant: a few hundred KB, blurred placeholders hold the space, the hero is preloaded, nothing moves.",
        "Right-click an Instant image → Open in new tab: it's a WebP resized to the frame's width, not the 2400px original.",
      ]}
      takeaways={[
        <>Images are usually the heaviest thing on the page. <code>next/image</code> resizes (<code>srcset</code> + <code>sizes</code>), converts to WebP/AVIF, and caches the result.</>,
        <>Always reserve space: <code>width</code>/<code>height</code> (automatic with static imports) or <code>fill</code> + a sized parent. That&apos;s your CLS fix.</>,
        <>Prioritize the LCP image (<code>preload</code> or <code>fetchPriority=&quot;high&quot;</code>) and lazy-load the rest (the default).</>,
        <>Don&apos;t preload or eager-load everything: if every image is high priority, none is. Tiny icons/SVGs don&apos;t need the optimizer.</>,
      ]}
    >
      <FrameCompare
        naive={{ src: "/frame/images/naive", label: "Raw <img>: huge PNGs, no dimensions, all eager" }}
        instant={{ src: "/frame/images/instant", label: "next/image: sized, WebP, blur, preloaded hero" }}
        marks={["shell", "lcp"]}
        height={520}
      />
    </DemoPage>
  );
}
