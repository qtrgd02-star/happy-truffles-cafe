import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitRemaining, getRateLimitReset, RateLimitConfig } from "@/app/lib/rate-limit";

const config: RateLimitConfig = {
  windowMs: 60 * 1000,
  max: 100,
};

export function withRateLimit(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const key = `rate-limit:${ip}`;

    if (!checkRateLimit(key, config)) {
      const retryAfter = Math.ceil((getRateLimitReset(key, config) - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests", retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    return handler(req);
  };
}

export function getRateLimitHeaders(key: string) {
  return {
    "X-RateLimit-Limit": config.max.toString(),
    "X-RateLimit-Remaining": getRateLimitRemaining(key, config).toString(),
    "X-RateLimit-Reset": getRateLimitReset(key, config).toString(),
  };
}