import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "node22",
  outDir: "dist",

  platform: "node",

  esbuildOptions(options) {
    options.outExtension = { ".js": ".js" };
  },
});
