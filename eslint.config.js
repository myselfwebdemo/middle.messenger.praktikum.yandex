import eslintRecommended from "eslint/conf/eslint-recommended.js";

export default [
  {
    files: ["*.js", "*.ts", "*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "no-unused-vars": "error",
      "max-len": ["warn", { "code": 100 }],
      "max-params": ["error", 3]
    },
    ignores: ["build/*", "node_modules/*"]
  }
];
