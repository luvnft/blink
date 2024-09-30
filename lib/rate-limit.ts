import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function rateLimit(identifier: string) {
  const key = `ratelimit:${identifier}`
  const limit = parseInt(process.env.RATE_LIMIT_MAX || '100')
  const duration = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes in milliseconds

  const requests = await redis.incr(key)
  if (requests === 1) {
    await redis.expire(key, Math.floor(duration / 1000))
  }

  const remaining = Math.max(0, limit - requests)
  const reset = await redis.ttl(key)

  return {
    success: requests <= limit,
    remaining,
    reset: reset > 0 ? reset : duration / 1000,
  }
}