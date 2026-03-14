/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a sliding window approach per IP address.
 * Note: resets on server restart; for multi-instance use Upstash Redis instead.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
            if (entry.resetAt < now) store.delete(key);
        }
    }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
    /** Maximum requests allowed per window */
    limit: number;
    /** Window duration in seconds */
    windowSecs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

export function rateLimit(
    identifier: string,
    { limit, windowSecs }: RateLimitOptions
): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSecs * 1000;

    const entry = store.get(identifier);

    if (!entry || entry.resetAt < now) {
        // New window
        const resetAt = now + windowMs;
        store.set(identifier, { count: 1, resetAt });
        return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (entry.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get the real client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return request.headers.get('x-real-ip') ?? 'unknown';
}
