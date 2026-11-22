"use client";
// Loaded only in the browser (next/dynamic ssr:false) so Zero never runs during SSR.
import { ZeroClient, ZeroTodos } from "./ZeroTodos";

export default function ZeroPanels({ device }: { device: "A" | "B" }) {
  return (
    // A persists to IndexedDB (survives reloads, works offline); B is a throwaway in-memory client.
    <ZeroClient kvStore={device === "A" ? "idb" : "mem"}>
      <ZeroTodos compact={device === "B"} />
    </ZeroClient>
  );
}
