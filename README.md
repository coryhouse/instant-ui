# Instant UI

Techniques for web apps that feel instant: live demos and slides for a 60-minute talk by Cory House.

Every demo shows a **Naive** version next to an **Instant** version so you can see (and time) the difference. A global latency slider simulates a slow server, and a "fail 50% of writes" toggle lets you test rollbacks. Everything runs locally and offline: no CDNs, no external APIs, no remote fonts.

Built with Next.js 16 (Cache Components, Partial Prefetching, React Compiler), React 19.3, TypeScript, Tailwind v4, TanStack Query and Virtual, Dexie, and Rocicorp Zero. Slides use [Slidev](https://sli.dev).

## Prerequisites

- Node 24
- pnpm 9 (`corepack enable`)
- Docker: only needed for the Zero sync engine demo (#14)

## Setup

```bash
pnpm i            # install the app
pnpm dev          # demos at http://localhost:3000
pnpm --dir slides i   # once: install the slide deck
pnpm slides       # slides at http://localhost:3030
```

The slides are a standalone package in `slides/` with their own lockfile:

```bash
pnpm --dir slides i        # once
pnpm --dir slides dev      # http://localhost:3030
pnpm --dir slides build    # static build in slides/dist
pnpm --dir slides export   # PDF (see note below)
```

> PDF export uses `playwright-chromium`. If it asks for a browser, run `pnpm --dir slides exec playwright install chromium` once.

### Zero demo (#14)

<!-- TODO(lead): confirm exact commands with the Zero demo setup -->

```bash
pnpm zero:up       # start Postgres in Docker (TODO: confirm)
pnpm zero:cache    # start zero-cache (TODO: confirm)
pnpm dev
```

Start these before the talk. The other 18 demos don't need Docker.

## Demos

| # | Demo | Section | Route | Idea |
| --- | --- | --- | --- | --- |
| 1 | Static rendering | Render less, earlier | [`/static`](http://localhost:3000/static) | Render at build time, serve from the edge. The fastest server is no server. |
| 2 | Partial prerendering | Render less, earlier | [`/ppr`](http://localhost:3000/ppr) | Ship a static shell instantly, stream the dynamic holes into it. |
| 3 | Streaming & Suspense | Render less, earlier | [`/streaming`](http://localhost:3000/streaming) | Kill waterfalls, fetch in parallel, reveal content as it's ready. |
| 4 | Lazy loading | Ship less | [`/lazy`](http://localhost:3000/lazy) | Don't download code the user hasn't asked for yet. |
| 5 | Image optimization | Ship less | [`/images`](http://localhost:3000/images) | Right size, right format, right priority. |
| 6 | Prefetch & preload | Ship less | [`/prefetch`](http://localhost:3000/prefetch) | Start the work before the click. |
| 7 | Client cache (SWR) | Cache everything | [`/caching/client`](http://localhost:3000/caching/client) | Show cached data instantly, revalidate in the background. |
| 8 | Server cache | Cache everything | [`/caching/server`](http://localhost:3000/caching/server) | `use cache` + tags: compute once, invalidate precisely. |
| 9 | HTTP cache | Cache everything | [`/caching/http`](http://localhost:3000/caching/http) | Cache-Control lets the browser and CDN skip the trip entirely. |
| 10 | Service worker cache | Cache everything | [`/caching/sw`](http://localhost:3000/caching/sw) | A programmable proxy in the browser. Works offline. |
| 11 | Optimistic UI | Don't wait for the server | [`/optimistic`](http://localhost:3000/optimistic) | Assume success, show it now, roll back if wrong. |
| 12 | Local-first | Don't wait for the server | [`/local-first`](http://localhost:3000/local-first) | The local database is the source of truth. The network is a sync detail. |
| 13 | Sync engine (hand-rolled) | Don't wait for the server | [`/sync/hand-rolled`](http://localhost:3000/sync/hand-rolled) | Mutation queue + server log + push. How sync engines work. |
| 14 | Sync engine (Zero) | Don't wait for the server | [`/sync/zero`](http://localhost:3000/sync/zero) | A production sync engine: queries run locally, Postgres stays in sync. |
| 15 | Memoization | Keep the main thread free | [`/memo`](http://localhost:3000/memo) | Skip work you've already done. Or let the React Compiler do it. |
| 16 | Transitions | Keep the main thread free | [`/transitions`](http://localhost:3000/transitions) | Keep input responsive by marking expensive updates as interruptible. |
| 17 | Virtualization | Keep the main thread free | [`/virtualization`](http://localhost:3000/virtualization) | Render only what's on screen. |
| 18 | Web workers | Keep the main thread free | [`/workers`](http://localhost:3000/workers) | Move heavy compute off the main thread to protect INP. |
| 19 | View transitions | Feel faster | [`/view-transitions`](http://localhost:3000/view-transitions) | Animate continuity so changes feel immediate and connected. |

The order and copy come from [`src/lib/demos.ts`](src/lib/demos.ts).

## Presenting tips

- **Latency slider** (header): simulated server delay, default 1000ms. Crank it to 2000ms to make differences obvious on a projector.
- **Fail 50% of writes** toggle: use it in the optimistic UI and sync demos to show rollback. Turn it off afterward.
- **Reload both**: page-load demos use side-by-side iframes (`FrameCompare`). Click "Reload both" to restart them at the same moment and compare the timing badges.
- **Two windows** for the sync demos (#13, #14): put two browser windows side by side to show changes propagating.
- **Production build for real numbers**: dev mode renders on demand and doesn't prefetch. For static rendering, PPR, and prefetching, run:

  ```bash
  pnpm build && pnpm start
  ```

- **DevTools**: the Network panel (throttling, offline, cache hits) and Performance panel (long tasks) make good second screens. CPU throttling 4x exaggerates main-thread demos.
- Speaker notes in the slides include a cue for every demo. Press `P` in Slidev for presenter mode.

## Repo structure

```
src/
  app/
    (site)/<slug>/     demo pages (header + latency slider)
    frame/<slug>/      bare pages loaded in side-by-side iframes
    api/<slug>/        route handlers used by demos
  components/          shared UI: DemoPage, Compare, FrameCompare, Timing, SettingsBar, ...
  lib/
    demos.ts           demo registry (talk order)
    settings.ts        simulated network settings (latency, fail writes)
    db.ts              fake in-memory database (goes through the simulated delay)
    caching/ local-first/ sync-engine/ zero/   demo-specific helpers
slides/                Slidev deck (standalone package)
  slides.md            the deck
  components/          DemoLink, DemoFrame
public/                static assets (images, service worker)
```
