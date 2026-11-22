import Link from "next/link";
import type { ReactNode } from "react";
import { getDemo } from "@/lib/demos";

/**
 * Standard wrapper for every demo: title, one-line idea, "try this" steps,
 * the demo itself, key takeaways, and prev/next navigation in talk order.
 */
export function DemoPage({ slug, children, tryThis, takeaways }: {
  slug: string;
  children: ReactNode;
  tryThis?: ReactNode[];
  takeaways?: ReactNode[];
}) {
  const { demo, prev, next, number } = getDemo(slug);
  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {number}. {demo.section}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{demo.title}</h1>
        <p className="text-lg text-muted">{demo.summary}</p>
      </header>

      {tryThis && tryThis.length > 0 && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <span className="font-semibold">Try this: </span>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5">
            {tryThis.map((t, i) => <li key={i}>{t}</li>)}
          </ol>
        </div>
      )}

      {children}

      {takeaways && takeaways.length > 0 && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <span className="font-semibold">Takeaways</span>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {takeaways.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      <nav className="flex justify-between border-t border-border pt-4 text-sm">
        {prev ? <Link href={`/${prev.slug}`} className="hover:underline">← {prev.title}</Link> : <span />}
        {next ? <Link href={`/${next.slug}`} className="hover:underline">{next.title} →</Link> : <Link href="/" className="hover:underline">All demos</Link>}
      </nav>
    </article>
  );
}
