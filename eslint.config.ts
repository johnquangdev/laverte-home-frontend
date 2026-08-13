import importPlugin from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "**/.next/**",
      "out/**",
      "public/**",
      ".gitignore",
      ".husky",
      "**/dist/**",
      "**/build/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierRecommended,
      tailwindcss.configs["flat/recommended"],
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
      react: reactPlugin,
      tailwindcss,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      tailwindcss: {
        callees: ["clsx", "cn"],
        config: false,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          trailingComma: "es5",
        },
      ],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-console": "warn",
      "require-await": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^next", "^[a-z]"],
            ["^@"],
            ["^~"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
            ["^\\u0000"],
          ],
        },
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Use the '@/' alias instead of parent relative imports.",
            },
          ],
        },
      ],
      // Tailwind CSS v4 rules
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/migration-from-tailwind-2": "off", // Not needed for v4
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "warn",
    },
  }
);
