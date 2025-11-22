import { getRedis } from "../../config/redis";

const redis = getRedis();

function key(userId: number) {
  return `rt:${userId}`;
}

export class RefreshTokenService {
  async save(userId: number, token: string) {
    await redis.set(key(userId), token, { EX: 60 * 60 * 24 * 7 });
  }

  async get(userId: number): Promise<string | null> {
    return redis.get(key(userId));
  }

  async delete(userId: number) {
    await redis.del(key(userId));
  }
}

export const refreshTokenService = new RefreshTokenService();
