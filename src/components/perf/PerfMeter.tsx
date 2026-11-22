"use client";
import { useEffect, useState } from "react";

type Metric = "js" | "img" | "cls" | "lcp";
type Stats = { js: number; jsWire: number; jsCount: number; img: number; imgCount: number; cls: number; lcp: number | null };

/**
 * Live performance readout for a frame page, measured in the page itself with
 * PerformanceObserver: JS/image bytes (Resource Timing), layout shift (CLS) and LCP.
 * Also reports "lcp" to <FrameCompare> once the page has loaded.
 */
export function PerfMeter({ show }: { show: Metric[] }) {
  const [s, setS] = useState<Stats>({ js: 0, jsWire: 0, jsCount: 0, img: 0, imgCount: 0, cls: 0, lcp: null });

  useEffect(() => {
    const observers: PerformanceObserver[] = [];
    const observe = (type: string, cb: (list: PerformanceObserverEntryList) => void) => {
      try {
        const o = new PerformanceObserver(cb);
        o.observe({ type, buffered: true });
        observers.push(o);
      } catch {}
    };

    observe("resource", (list) => {
      const add = { js: 0, jsWire: 0, jsCount: 0, img: 0, imgCount: 0 };
      for (const e of list.getEntries() as PerformanceResourceTiming[]) {
        const size = e.decodedBodySize || e.encodedBodySize;
        const path = new URL(e.name).pathname;
        if (e.initiatorType === "script" || path.endsWith(".js")) {
          add.js += size;
          add.jsWire += e.encodedBodySize;
          add.jsCount++;
        } else if (e.initiatorType === "img" || /\.(png|jpe?g|webp|avif)$/.test(path) || path.startsWith("/_next/image") || path.startsWith("/api/images/")) {
          add.img += e.encodedBodySize || e.decodedBodySize;
          add.imgCount++;
        }
      }
      setS((p) => ({ ...p, js: p.js + add.js, jsWire: p.jsWire + add.jsWire, jsCount: p.jsCount + add.jsCount, img: p.img + add.img, imgCount: p.imgCount + add.imgCount }));
    });

    observe("layout-shift", (list) => {
      let add = 0;
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!e.hadRecentInput) add += e.value;
      }
      setS((p) => ({ ...p, cls: p.cls + add }));
    });

    let lcp: number | null = null;
    observe("largest-contentful-paint", (list) => {
      const last = list.getEntries().at(-1);
      if (last) setS((p) => ({ ...p, lcp: (lcp = Math.round(last.startTime)) }));
    });

    // LCP is final once the page has loaded and the images in view have finished;
    // then report it to the FrameCompare badge.
    let timer: ReturnType<typeof setTimeout>;
    const report = () => {
      const pending = [...document.images].some((img) => !img.complete && img.getBoundingClientRect().top < innerHeight);
      if (pending || lcp === null) {
        timer = setTimeout(report, 100);
        return;
      }
      timer = setTimeout(() => {
        const m = { type: "instant-ui:mark", name: "lcp", at: lcp };
        const w = window as typeof window & { __marks?: unknown[] };
        (w.__marks ??= []).push(m);
        window.parent?.postMessage(m, "*");
      }, 200);
    };
    if (document.readyState === "complete") report();
    else window.addEventListener("load", report, { once: true });

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const cards: Record<Metric, { label: string; value: string; sub?: string; bad: boolean | null }> = {
    js: { label: "JavaScript", value: fmtBytes(s.js), sub: `${s.jsCount} files · ${fmtBytes(s.jsWire)} on the wire`, bad: null },
    img: { label: "Image bytes", value: fmtBytes(s.img), sub: `${s.imgCount} requests`, bad: s.img > 1_000_000 },
    cls: { label: "Layout shift (CLS)", value: s.cls.toFixed(3), sub: s.cls < 0.1 ? "good" : "poor", bad: s.cls >= 0.1 },
    lcp: { label: "LCP", value: s.lcp === null ? "—" : `${s.lcp}ms`, sub: "largest paint", bad: (s.lcp ?? 0) > 2500 },
  };

  return (
    <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-3 grid gap-2 border-b border-border bg-background/95 p-2 backdrop-blur" style={{ gridTemplateColumns: `repeat(${show.length}, minmax(0, 1fr))` }}>
      {show.map((k) => (
        <div key={k} className={`rounded-lg px-2 py-1 ${cards[k].bad === null ? "bg-surface text-foreground" : cards[k].bad ? "bg-danger/15 text-danger" : "bg-success/15 text-success"}`}>
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{cards[k].label}</div>
          <div className="font-mono text-2xl font-bold tabular-nums">{cards[k].value}</div>
          {cards[k].sub && <div className="text-[10px] opacity-80">{cards[k].sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function fmtBytes(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(n / 1000)} KB`;
}
