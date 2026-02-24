type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function now() { return Date.now(); }

export function rateLimit(key: string, limitPerMin: number) {
  const t = now();
  const windowMs = 60_000;

  const b = buckets.get(key);
  if (!b || t > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: t + windowMs });
    return { ok: true, remaining: limitPerMin - 1 };
  }

  if (b.count >= limitPerMin) {
    return { ok: false, remaining: 0, retryAfterMs: b.resetAt - t };
  }

  b.count += 1;
  buckets.set(key, b);
  return { ok: true, remaining: Math.max(0, limitPerMin - b.count) };
}
