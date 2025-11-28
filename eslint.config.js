import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "test-results/**", "coverage/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // ---- Formatting (Prettier) ----
      // "prettier/prettier": "warn",

      // ---- Balanced TS Rules ----
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "@typescript-eslint/no-explicit-any": "off", // balanced
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-imports": "warn",

      // ---- Safe console rules ----
      "no-console": ["warn", { allow: ["warn", "error", "info", "debug"] }],

      // ---- General JS Rules ----
      "no-undef": "off",
      "no-async-promise-executor": "warn",
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
];
