import type { ReactNode } from "react";

export function Compare({ naive, instant, naiveLabel = "Naive", instantLabel = "Instant" }: {
  naive: ReactNode;
  instant: ReactNode;
  naiveLabel?: string;
  instantLabel?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel tone="naive" label={naiveLabel}>{naive}</Panel>
      <Panel tone="instant" label={instantLabel}>{instant}</Panel>
    </div>
  );
}

export function Panel({ tone, label, children }: { tone: "naive" | "instant"; label: string; children: ReactNode }) {
  return (
    <section className={`rounded-xl border bg-surface p-4 ${tone === "naive" ? "border-danger/40" : "border-success/50"}`}>
      <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${tone === "naive" ? "text-danger" : "text-success"}`}>
        {tone === "naive" ? "🐢" : "⚡"} {label}
      </h2>
      {children}
    </section>
  );
}
