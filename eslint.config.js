import { defineConfig } from "eslint-define-config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig({
  languageOptions: {
    globals: {
      browser: "readonly",
      es2021: "readonly",
    },
  },
  plugins: {
    prettier: eslintPluginPrettier,
  },
  rules: {
    "prettier/prettier": "error",
  },
  settings: {
    // Добавьте любые настройки, которые вам могут понадобиться
  },
  // Включите конфигурации напрямую
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      extends: ["eslint:recommended", "plugin:prettier/recommended"],
      rules: {
        "prettier/prettier": "error",
      },
    },
  ],
});
