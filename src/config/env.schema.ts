import { z } from "zod";

export const EnvSchema = z.object({
  APP_NAME: z.string(),
  APP_ENV: z.enum(["development", "staging", "production"]),
  APP_PORT: z.string().transform(Number),
  CORS_ORIGIN: z.string().transform((v) => v.split(",")),

  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  REDIS_PASS: z.string().optional(),
  REDIS_DB: z.string().transform(Number),

  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),

  KAFKA_ENABLED: z.string().transform((v) => v === "true"),
  KAFKA_BROKERS: z.string().transform((v) => v.split(",")),
  KAFKA_CLIENT_ID: z.string(),

  MONGO_URI: z.string(),
  MONGO_DB: z.string(),
  MONGO_COLLECTION: z.string(),
  MONGO_TTL: z.string().transform(Number),

  HELMET_CSP: z.string().transform((v) => v === "true"),
  HELMET_COEP: z.string().transform((v) => v === "true"),

  RATE_LIMIT_WINDOW_MS: z.string().transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number),

  LOGGER_ENABLED: z.string().transform((v) => v === "true"),
  LOGGER_LEVEL: z.string(),
});

export type EnvType = z.infer<typeof EnvSchema>;
