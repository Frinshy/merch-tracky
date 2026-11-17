import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  globalIgnores([".next/**", "node_modules/**", "public/**", "next-env.d.ts"]),

  // Next.js recommended rules (React, hooks, a11y, imports, Core Web Vitals) + TypeScript.
  ...nextCoreWebVitals,
  ...nextTypescript,

  // Runs Prettier as a lint rule and turns off conflicting style rules.
  prettierRecommended,

  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "no-console": "warn",
      "prettier/prettier": "warn",

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        { callbacksLast: true, shorthandFirst: true, reservedFirst: true },
      ],

      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
    },
  },
]);
