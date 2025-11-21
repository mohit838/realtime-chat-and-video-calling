import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { z } from "zod";
import { EnvSchema, type EnvType } from "./env.schema";

const envPath = path.resolve(process.cwd(), "env/env.yml");

function loadYaml(): EnvType {
  const fileContents = fs.readFileSync(envPath, "utf8");

  const rawConfig: unknown = yaml.load(fileContents);

  const parsed = EnvSchema.safeParse(rawConfig);

  if (!parsed.success) {
    console.error("Invalid env.yml configuration\n");

    const treeError = z.treeifyError(parsed.error);

    console.error(treeError, { depth: null, colors: true });

    process.exit(1);
  }

  return parsed.data;
}

export const env = loadYaml();
