/**
 * Busy-waits for `ms` milliseconds, blocking the main thread.
 * Stands in for "an expensive render" in the demos.
 */
export function burn(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // spin
  }
}
