import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],

  format: ["esm"],

  outDir: "dist",
  target: "node22",

  dts: true,
  splitting: false, // backend => no code splitting needed
  sourcemap: true,
  clean: true,

  // Node.js features (process, fs, buffer, globals)
  platform: "node",

  // Enable this to include .env or other assets if needed
  // assets: { baseDir: "src", include: ["config/**/*.yaml"] },

  // Keep dynamic imports intact
  shims: false,

  // Don't minify — debugging backend is easier
  minify: false,

  // Ensure ESM imports resolve correctly (.js)
  esbuildOptions(options) {
    options.outExtension = {
      ".js": ".js",
    };
  },
});
