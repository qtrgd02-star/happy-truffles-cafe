import { RateLimitEntry, RateLimitConfig } from "./types";

export type { RateLimitEntry, RateLimitConfig };

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.max) {
    return false;
  }

  entry.count++;
  return true;
}

export function getRateLimitRemaining(key: string, config: RateLimitConfig): number {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    return config.max;
  }

  return Math.max(0, config.max - entry.count);
}

export function getRateLimitReset(key: string, config: RateLimitConfig): number {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    return now + config.windowMs;
  }

  return entry.resetTime;
}