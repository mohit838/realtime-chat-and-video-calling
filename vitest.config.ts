import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    // Pick up all test files
    include: ["test/**/*.{test,spec}.ts"],

    // Generate coverage reports
    coverage: {
      reporter: ["text", "json", "html"],
      reportsDirectory: "test-results/coverage",
    },

    // Save test results to JSON
    outputFile: "test-results/results.json",
  },
});
