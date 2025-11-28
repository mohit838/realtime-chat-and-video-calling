import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { EnvSchema, type EnvType } from "./env.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../config/env.yml");

function loadYaml(): EnvType {
  if (!fs.existsSync(envPath)) {
    console.error(`env.yml not found at: ${envPath}`);
    process.exit(1);
  }

  const fileContents = fs.readFileSync(envPath, "utf8");

  let rawConfig: unknown;
  try {
    rawConfig = yaml.load(fileContents);
  } catch (error) {
    console.error("Failed to parse env.yml:", error);
    process.exit(1);
  }

  const parsed = EnvSchema.safeParse(rawConfig);

  if (!parsed.success) {
    console.error("Invalid env.yml configuration");

    const treeError = z.treeifyError(parsed.error);
    console.error(treeError, { depth: null, colors: true });

    process.exit(1);
  }

  return parsed.data;
}

export const env = loadYaml();
