import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    // Use the existing environment variables from your .env file
    const redisUrl = process.env.KV_REST_API_URL;
    const redisToken = process.env.KV_REST_API_TOKEN;

    if (!redisUrl || !redisToken) {
      throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required");
    }

    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }

  return redis;
}
