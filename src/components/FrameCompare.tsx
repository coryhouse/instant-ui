"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "./Compare";
import { TimingBadge } from "./Timing";

type Marks = Record<string, number>;

/**
 * Loads two full pages side by side in iframes so server-rendering strategies can be
 * compared as real page loads. Pages report timings via <Mark name="..." />.
 */
export function FrameCompare({ naive, instant, marks = ["shell", "content"], height = 420 }: {
  naive: { src: string; label?: string };
  instant: { src: string; label?: string };
  marks?: string[];
  height?: number;
}) {
  const [nonce, setNonce] = useState(0);
  return (
    <div className="space-y-3">
      <button
        onClick={() => setNonce((n) => n + 1)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        ↻ Reload both
      </button>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Keying by nonce remounts each frame (and resets its timings) on reload. */}
        <Frame key={`n${nonce}`} tone="naive" {...naive} marks={marks} height={height} />
        <Frame key={`i${nonce}`} tone="instant" {...instant} marks={marks} height={height} />
      </div>
    </div>
  );
}

function Frame({ tone, src, label, marks, height }: {
  tone: "naive" | "instant";
  src: string;
  label?: string;
  marks: string[];
  height: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [timings, setTimings] = useState<Marks>({});

  const record = useCallback(
    (name: string, at: number) => setTimings((t) => (name in t ? t : { ...t, [name]: at })),
    [],
  );

  // Marks that arrive before this listener is attached are buffered in the frame's
  // window.__marks and picked up on load (both are same-origin).
  const readBuffered = useCallback(() => {
    const w = ref.current?.contentWindow as (Window & { __marks?: { name: string; at: number }[] }) | null;
    w?.__marks?.forEach((m) => record(m.name, m.at));
  }, [record]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== ref.current?.contentWindow || e.data?.type !== "instant-ui:mark") return;
      record(e.data.name, e.data.at);
    }
    window.addEventListener("message", onMessage);
    // The frame may have finished loading before this component hydrated.
    readBuffered();
    return () => window.removeEventListener("message", onMessage);
  }, [record, readBuffered]);

  return (
    <Panel tone={tone} label={label ?? (tone === "naive" ? "Naive" : "Instant")}>
      <div className="mb-2 flex flex-wrap gap-2">
        {marks.map((m) => (
          <TimingBadge key={m} label={m} ms={timings[m] ?? null} />
        ))}
        <a href={src} target="_blank" className="ml-auto text-xs text-muted underline">open ↗</a>
      </div>
      <iframe
        ref={ref}
        src={src}
        onLoad={readBuffered}
        className="w-full rounded-lg border border-border bg-background"
        style={{ height }}
        title={label ?? tone}
      />
    </Panel>
  );
}
