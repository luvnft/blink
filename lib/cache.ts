import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL

export async function cacheSet<T>(key: string, value: T, ttl?: number): Promise<void> {
  cache.set(key, value, ttl);
}

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  return cache.get<T>(key);
}

export async function cacheDelete(key: string): Promise<void> {
  cache.del(key);
}

export async function cacheClear(): Promise<void> {
  cache.flushAll();
}