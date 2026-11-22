"use client";
import { useEffect } from "react";

/** Like <Mark>, but reports when a client component mounts (after hydration/client fetch). */
export function ClientMark({ name }: { name: string }) {
  useEffect(() => {
    const at = Math.round(performance.now());
    const mark = { type: "instant-ui:mark", name, at };
    const w = window as typeof window & { __marks?: unknown[] };
    (w.__marks ??= []).push(mark);
    window.parent?.postMessage(mark, "*");
  }, [name]);
  return null;
}
