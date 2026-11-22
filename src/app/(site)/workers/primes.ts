/** Deliberately slow prime counter (trial division). ~1–4s for 5–15 million. */
export function countPrimes(limit: number) {
  let count = 0;
  for (let n = 2; n < limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}

export type PrimeResult = { limit: number; count: number; ms: number };
