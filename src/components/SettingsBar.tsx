"use client";
import { updateSettings, useSettings } from "@/lib/client-settings";

export function SettingsBar() {
  const { latency, failRate } = useSettings();
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <label className="flex items-center gap-2">
        <span className="text-muted">Latency</span>
        <input
          type="range"
          min={0}
          max={3000}
          step={100}
          value={latency}
          onChange={(e) => updateSettings({ latency: Number(e.target.value) })}
          className="w-32 accent-accent"
          aria-label="Simulated network latency"
        />
        <output className="w-16 tabular-nums font-mono">{latency}ms</output>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={failRate > 0}
          onChange={(e) => updateSettings({ failRate: e.target.checked ? 0.5 : 0 })}
          className="accent-danger"
        />
        <span className="text-muted">Fail 50% of writes</span>
      </label>
    </div>
  );
}
