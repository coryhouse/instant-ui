// Runs on a separate thread: no DOM, no React, just postMessage in and out.
import { countPrimes, type PrimeResult } from "./primes";

self.onmessage = (e: MessageEvent<number>) => {
  const limit = e.data;
  const start = performance.now();
  const count = countPrimes(limit);
  const result: PrimeResult = { limit, count, ms: Math.round(performance.now() - start) };
  self.postMessage(result);
};
