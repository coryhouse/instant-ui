export type Demo = {
  slug: string;
  title: string;
  section: string;
  summary: string;
};

/** Talk order. Each demo lives at `/${slug}`. */
export const demos: Demo[] = [
  { slug: "static", section: "Render less, earlier", title: "Static rendering", summary: "Render at build time, serve from the edge. The fastest server is no server." },
  { slug: "ppr", section: "Render less, earlier", title: "Partial prerendering", summary: "Ship a static shell instantly, stream the dynamic holes into it." },
  { slug: "streaming", section: "Render less, earlier", title: "Streaming & Suspense", summary: "Kill waterfalls, fetch in parallel, reveal content as it's ready." },
  { slug: "lazy", section: "Ship less", title: "Lazy loading", summary: "Don't download code the user hasn't asked for yet." },
  { slug: "images", section: "Ship less", title: "Image optimization", summary: "Right size, right format, right priority." },
  { slug: "prefetch", section: "Ship less", title: "Prefetch & preload", summary: "Start the work before the click." },
  { slug: "caching/client", section: "Cache everything", title: "Client cache (SWR)", summary: "Show cached data instantly, revalidate in the background." },
  { slug: "caching/server", section: "Cache everything", title: "Server cache", summary: "`use cache` + tags: compute once, invalidate precisely." },
  { slug: "caching/http", section: "Cache everything", title: "HTTP cache", summary: "Cache-Control lets the browser and CDN skip the trip entirely." },
  { slug: "caching/sw", section: "Cache everything", title: "Service worker cache", summary: "A programmable proxy in the browser. Works offline." },
  { slug: "optimistic", section: "Don't wait for the server", title: "Optimistic UI", summary: "Assume success, show it now, roll back if wrong." },
  { slug: "local-first", section: "Don't wait for the server", title: "Local-first", summary: "The local database is the source of truth. The network is a sync detail." },
  { slug: "sync/hand-rolled", section: "Don't wait for the server", title: "Sync engine (hand-rolled)", summary: "Mutation queue + server log + push. How sync engines work." },
  { slug: "sync/zero", section: "Don't wait for the server", title: "Sync engine (Zero)", summary: "A production sync engine: queries run locally, Postgres stays in sync." },
  { slug: "memo", section: "Keep the main thread free", title: "Memoization", summary: "Skip work you've already done. Or let the React Compiler do it." },
  { slug: "transitions", section: "Keep the main thread free", title: "Transitions", summary: "Keep input responsive by marking expensive updates as interruptible." },
  { slug: "virtualization", section: "Keep the main thread free", title: "Virtualization", summary: "Render only what's on screen." },
  { slug: "workers", section: "Keep the main thread free", title: "Web workers", summary: "Move heavy compute off the main thread to protect INP." },
  { slug: "view-transitions", section: "Feel faster", title: "View transitions", summary: "Animate continuity so changes feel immediate and connected." },
];

export function getDemo(slug: string) {
  const index = demos.findIndex((d) => d.slug === slug);
  if (index === -1) throw new Error(`Unknown demo: ${slug}`);
  return { demo: demos[index], prev: demos[index - 1], next: demos[index + 1], number: index + 1 };
}
