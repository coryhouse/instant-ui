"use client";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Measures how long the list took to mount (click → rows committed to the DOM)
 * and counts the DOM nodes inside it, re-counting on scroll.
 */
export function useListStats(startedAt: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [mountMs, setMountMs] = useState<number | null>(null);
  const [nodes, setNodes] = useState(0);

  useLayoutEffect(() => {
    // Runs synchronously after React commits the rows, before the browser paints.
    const ms = Math.round(performance.now() - startedAt);
    const el = ref.current;
    if (!el) return;
    const count = () => setNodes(el.querySelectorAll("*").length);
    // Show the numbers on the next frame (the measurement is already taken).
    const raf = requestAnimationFrame(() => {
      setMountMs(ms);
      count();
    });
    el.addEventListener("scroll", count, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", count);
    };
  }, [startedAt]);

  return { ref, mountMs, nodes };
}
