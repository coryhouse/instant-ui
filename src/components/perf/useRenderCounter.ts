"use client";
import { useLayoutEffect, useRef } from "react";

/**
 * Counts commits of the component that calls it and flashes the element the
 * returned ref is attached to. Writes to the DOM directly, so counting
 * renders never causes extra renders.
 */
export function useRenderCounter<T extends HTMLElement = HTMLSpanElement>() {
  const ref = useRef<T>(null);
  const count = useRef(0);
  // Runs on mount only (and again on StrictMode's simulated remount): reset.
  useLayoutEffect(() => {
    count.current = 0;
  }, []);
  // No deps: runs after every commit of this component.
  useLayoutEffect(() => {
    count.current += 1;
    const el = ref.current;
    if (!el) return;
    el.textContent = String(count.current);
    el.animate(
      [{ backgroundColor: "rgba(255, 170, 0, 0.75)" }, { backgroundColor: "rgba(255, 170, 0, 0)" }],
      { duration: 500, easing: "ease-out" },
    );
  });
  return ref;
}
