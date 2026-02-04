/**
 * Rate limiting en memoria para APIs.
 * En producción considerar Redis para múltiples instancias.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 100; // por IP por ventana

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Comprueba y consume un intento de rate limit por identificador (ej: IP).
 */
export function rateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  let entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(identifier, entry);
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - entry.count);
  return {
    success: remaining >= 0,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Limpia entradas expiradas (opcional, para no crecer el Map).
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  Array.from(store.entries()).forEach(([key, value]) => {
    if (now > value.resetAt) store.delete(key);
  });
}
