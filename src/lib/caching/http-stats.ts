import "server-only";

/** How many times each HTTP-cache demo endpoint actually reached the server. */
export type HttpEndpoint = "no-store" | "max-age" | "etag";
export type HttpStats = Record<HttpEndpoint, { full: number; notModified: number }>;

const g = globalThis as typeof globalThis & { __instantUiHttpStats?: HttpStats };
const empty = (): HttpStats => ({
  "no-store": { full: 0, notModified: 0 },
  "max-age": { full: 0, notModified: 0 },
  etag: { full: 0, notModified: 0 },
});

export function getHttpStats() {
  return (g.__instantUiHttpStats ??= empty());
}

export function resetHttpStats() {
  g.__instantUiHttpStats = empty();
  return g.__instantUiHttpStats;
}

/** The "expensive" payload every endpoint returns. */
export function payload(endpoint: HttpEndpoint) {
  const hit = getHttpStats()[endpoint].full + getHttpStats()[endpoint].notModified;
  return { endpoint, serverHit: hit, servedAt: new Date().toISOString(), message: "Top 3 deals: Swift Keyboard, Turbo Mouse, Instant Monitor" };
}
