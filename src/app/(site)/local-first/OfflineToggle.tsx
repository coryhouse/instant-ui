"use client";
import { setOffline, useOffline } from "@/lib/local-first/network";

export function OfflineToggle() {
  const offline = useOffline();
  return (
    <label className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${offline ? "border-danger/50 bg-danger/10 text-danger" : "border-border bg-surface"}`}>
      <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} className="accent-danger" />
      ✈ Simulate offline (blocks both panels&apos; network)
    </label>
  );
}
