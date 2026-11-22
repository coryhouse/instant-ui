"use client";
import { useEffect, useState } from "react";

const KEY = "instant-ui:mpa-click";

/** Records the click time before a full-page (MPA) navigation. */
export function MpaLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className} onClick={() => sessionStorage.setItem(KEY, String(Date.now()))}>
      {children}
    </a>
  );
}

/**
 * On the destination: how long after the click the page was shown, and whether
 * the browser served it from a speculative prerender. A prerendered page runs
 * in the background, so we wait for activation before measuring.
 */
export function MpaArrived() {
  const [result, setResult] = useState<{ ms: number; prerendered: boolean } | null>(null);
  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming & { activationStart?: number };
      const clickedAt = Number(sessionStorage.getItem(KEY));
      sessionStorage.removeItem(KEY);
      if (clickedAt) setResult({ ms: Date.now() - clickedAt, prerendered: (nav?.activationStart ?? 0) > 0 });
    };
    const doc = document as Document & { prerendering?: boolean };
    if (doc.prerendering) {
      document.addEventListener("prerenderingchange", measure, { once: true });
      return () => document.removeEventListener("prerenderingchange", measure);
    }
    measure();
  }, []);
  if (!result) return null;
  const fast = result.ms < 300;
  return (
    <div className={`mb-3 rounded-lg px-3 py-2 text-center font-mono text-2xl font-bold text-white ${fast ? "bg-success" : "bg-danger"}`}>
      ⏱ {result.ms}ms after click
      <div className="text-sm font-normal">{result.prerendered ? "⚡ served from a speculative prerender" : "loaded after the click"}</div>
    </div>
  );
}
