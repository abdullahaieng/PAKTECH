type Counter = { count: number; firstSeen: number };

const store = new Map<string, Counter>();

export interface RateLimitOptions {
  windowMs?: number;
  max?: number;
}

export function rateLimit(key: string, options?: RateLimitOptions): { ok: boolean; remaining: number; reset: number } {
  const windowMs = options?.windowMs ?? 60_000; // 1 minute
  const max = options?.max ?? 10;

  const now = Date.now();
  const existing = store.get(key);
  if (!existing || now - existing.firstSeen > windowMs) {
    store.set(key, { count: 1, firstSeen: now });
    return { ok: true, remaining: max - 1, reset: now + windowMs };
  }

  existing.count += 1;
  store.set(key, existing);

  if (existing.count > max) {
    return { ok: false, remaining: 0, reset: existing.firstSeen + windowMs };
  }

  return { ok: true, remaining: max - existing.count, reset: existing.firstSeen + windowMs };
}

export function resetRateLimit(key: string) {
  store.delete(key);
}
