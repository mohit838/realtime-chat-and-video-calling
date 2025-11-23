import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    coverage: {
      provider: "istanbul",
      reporter: ["text", "html"],
      reportsDirectory: "./test-results/coverage",
      include: ["src/**/*.ts"],
      exclude: ["**/*.test.ts"],
    },
  },
});
