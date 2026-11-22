import Link from "next/link";
import { demos } from "@/lib/demos";

export default function Home() {
  const sections = [...new Set(demos.map((d) => d.section))];
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Instant UI</h1>
        <p className="max-w-2xl text-lg text-muted">
          Techniques for web apps that feel instant. Each demo compares a naive version with an optimized one. Use the
          latency slider to make the network as slow as you like.
        </p>
      </header>
      {sections.map((section) => (
        <section key={section} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{section}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demos.filter((d) => d.section === section).map((d) => (
              <li key={d.slug}>
                <Link href={`/${d.slug}`} className="block h-full rounded-xl border border-border bg-surface p-4 transition hover:border-accent">
                  <span className="text-xs text-muted">{demos.indexOf(d) + 1}</span>
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted">{d.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
