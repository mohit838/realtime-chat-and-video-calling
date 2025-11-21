import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  {
    files: ["src/**/*.{ts,js}"],

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // NOTE: Enable this rule if you want ESLint to report Prettier formatting issues
      // "prettier/prettier": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "no-console": ["warn", { allow: ["warn", "error", "info", "debug"] }],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
];
