import { z } from "zod";

export const EnvSchema = z.object({
  app: z.object({
    name: z.string(),
    env: z.enum(["development", "staging", "production"]),
    port: z.number(),
  }),

  db: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    pass: z.string(),
    name: z.string(),
  }),

  redis: z.object({
    host: z.string(),
    port: z.number(),
    pass: z.string(),
    db: z.number(),
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
});

export type EnvType = z.infer<typeof EnvSchema>;
