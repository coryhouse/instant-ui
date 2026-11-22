import type { ReactNode } from "react";
import { Mark } from "@/components/Mark";
import { PerfMeter } from "@/components/perf/PerfMeter";

/** Same page for both versions; only how the editor and images load differs. */
export function Article({ editor, imageLoading }: { editor: ReactNode; imageLoading: "eager" | "lazy" }) {
  return (
    <>
      <PerfMeter show={["js", "img"]} />
      <Mark name="shell" />
      <h1 className="text-xl font-bold">Release notes</h1>
      <p className="mb-3 text-muted">Most readers never open the editor. Should they pay for it?</p>
      {editor}
      <div className="my-4 space-y-2 text-muted">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>Paragraph {i + 1}: scroll down for the photo gallery. It&apos;s below the fold, so nobody sees it on load.</p>
        ))}
      </div>
      <h2 className="mb-2 font-semibold">Gallery (below the fold)</h2>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((n) => (
          // Plain <img> on purpose: this demo is about loading="lazy", not next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={`/demo-images/photo-${n}.png`} alt="" width={1200} height={800} loading={imageLoading} className="h-auto w-full rounded" />
        ))}
      </div>
    </>
  );
}
