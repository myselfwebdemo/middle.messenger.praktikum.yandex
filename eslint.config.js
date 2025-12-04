import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],

    ignores: [
      "build/**",
      "node_modules/**",
      "dist/**"
    ],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "max-len": "off",
      "max-params": "off",
      "no-unsafe-finally": "off"
    }
  }
];
