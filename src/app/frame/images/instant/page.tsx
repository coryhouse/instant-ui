import { Mark } from "@/components/Mark";
import { PerfMeter } from "@/components/perf/PerfMeter";
import { gallery, hero } from "../photos";
import { OptimizedImage as Image } from "./OptimizedImage";

// Instant: next/image resizes to the displayed size (srcset + sizes), converts to
// WebP/AVIF, reserves space from the known dimensions (no layout shift), shows a
// blur placeholder, preloads the LCP hero and lazy-loads everything else.
export default function Page() {
  return (
    <>
      <PerfMeter show={["img", "lcp", "cls"]} />
      <Mark name="shell" />
      <Image src={hero} alt="Hero" preload sizes="100vw" placeholder="blur" className="h-auto w-full rounded-lg" />
      <h1 className="mt-3 text-2xl font-bold">Summer collection</h1>
      <p className="mb-3 text-muted">Try to read this sentence while the images load.</p>
      <div className="grid grid-cols-2 gap-2">
        {gallery.map((photo, i) => (
          <Image key={i} src={photo} alt={`Photo ${i + 1}`} sizes="50vw" placeholder="blur" className="h-auto w-full rounded" />
        ))}
      </div>
    </>
  );
}
