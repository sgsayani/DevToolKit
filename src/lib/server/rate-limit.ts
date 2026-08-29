interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): boolean;
}

/** In-memory, single-instance, fixed-window limiter. Good enough as a
 * deterrent for a self-hosted dev tool — not a distributed rate limiter,
 * which would need something like Redis (an unnecessary dependency here). */
export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, Bucket>();

  function cleanup(now: number) {
    for (const [key, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(key);
    }
  }

  return {
    check(key: string): boolean {
      const now = Date.now();
      if (Math.random() < 0.02) cleanup(now);

      const bucket = buckets.get(key);
      if (!bucket || now >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (bucket.count >= maxRequests) return false;
      bucket.count++;
      return true;
    },
  };
}

// Default limiter used by the API-testing proxy and mock endpoints.
const defaultLimiter = createRateLimiter(30, 60_000);

export function checkRateLimit(key: string): boolean {
  return defaultLimiter.check(key);
}
