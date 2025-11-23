import { z } from "zod";

export const EnvSchema = z.object({
  app: z.object({
    name: z.string(),
    env: z.enum(["development", "staging", "production"]),
    port: z.coerce.number(),
    corsOrigin: z.union([z.string(), z.array(z.string())]).optional(),
  }),

  db: z.object({
    host: z.string(),
    port: z.coerce.number(),
    user: z.string(),
    pass: z.string(),
    name: z.string(),
  }),

  redis: z.object({
    host: z.string(),
    port: z.coerce.number(),
    pass: z.string(),
    db: z.coerce.number(),
  }),

  jwt: z.object({
    secret: z.string().min(10),
    expiry: z.union([z.number(), z.string()]),
  }),

  kafka: z.object({
    enabled: z.boolean(),
    brokers: z.array(z.string()).nonempty(),
    clientId: z.string().min(1),
  }),

  mongo: z.object({
    uri: z.url(),
    db: z.string(),
    collection: z.string(),
    ttlSeconds: z.coerce.number().default(864000), // 10 days
  }),

  helmet: z.object({
    contentSecurityPolicy: z.boolean().default(false),
    crossOriginEmbedderPolicy: z.boolean().default(false),
  }),

  rateLimiter: z.object({
    windowMs: z.coerce.number(),
    maxRequests: z.coerce.number(),
  }),

  logger: z.object({
    enabled: z.boolean(),
    level: z.enum(["info", "warn", "error", "debug"]),
  }),
});

export type EnvType = z.infer<typeof EnvSchema>;
