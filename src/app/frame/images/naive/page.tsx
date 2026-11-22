import { Mark } from "@/components/Mark";
import { PerfMeter } from "@/components/perf/PerfMeter";
import { throttled } from "../photos";

// Naive: raw <img> tags pointing at the original multi-MB PNGs. No width/height
// (so content jumps as each image arrives), no srcset (a phone downloads the
// 2400px original), and everything loads eagerly, competing with the hero.
export default function Page() {
  return (
    <>
      <PerfMeter show={["img", "lcp", "cls"]} />
      <Mark name="shell" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={throttled("/demo-images/hero.png", "naive")} alt="Hero" className="w-full rounded-lg" />
      <h1 className="mt-3 text-2xl font-bold">Summer collection</h1>
      <p className="mb-3 text-muted">Try to read this sentence while the images load.</p>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={throttled(`/demo-images/photo-${n}.png`, "naive")} alt={`Photo ${n}`} className="w-full rounded" />
        ))}
      </div>
    </>
  );
}
