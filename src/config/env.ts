import "dotenv/config";
import { EnvSchema } from "./env.schema.js";

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(">> Invalid .env configuration\n");
  console.error(parsed.error);
  process.exit(1);
}

export const env = parsed.data;
