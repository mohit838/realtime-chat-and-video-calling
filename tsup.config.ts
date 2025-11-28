import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",

  splitting: false,
  sourcemap: true,
  clean: true,
  shims: false,
  minify: false,
  dts: false,

  esbuildOptions(options) {
    options.outExtension = { ".js": ".js" };
  },
});
