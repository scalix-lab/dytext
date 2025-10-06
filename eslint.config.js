// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
