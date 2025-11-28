import { createClient, type RedisClientType } from "redis";
import { env } from "./env.js";

let client: RedisClientType | null = null;

export const getRedis = (): RedisClientType => {
  if (!client) {
    client = createClient({
      socket: {
        host: env.redis.host,
        port: env.redis.port,
      },
      password: env.redis.pass || undefined,
      database: env.redis.db,
    });

    client.on("connect", () => console.debug("## Redis connecting..."));
    client.on("ready", () => console.debug("## Redis ready"));
    client.on("error", (err) => console.error("## Redis error", err));

    client.connect().catch((err) => {
      console.error("## Redis initial connection failed", err);
    });

    console.debug("## Redis client created (singleton)");
  }

  return client;
};

export const testRedisConnection = async () => {
  try {
    const redis = getRedis();
    await redis.ping();
    console.debug("## Redis ping ok");
  } catch (err) {
    console.error("## Redis ping failed");
    console.error(err);
    process.exit(1);
  }
};
