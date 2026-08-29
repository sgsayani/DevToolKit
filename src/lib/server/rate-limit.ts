interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

/** In-memory, single-instance, fixed-window limiter. Good enough as a
 * deterrent for a self-hosted dev tool — not a distributed rate limiter,
 * which would need something like Redis (an unnecessary dependency here). */
const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  if (Math.random() < 0.02) cleanup(now);

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) return false;
  bucket.count++;
  return true;
}
