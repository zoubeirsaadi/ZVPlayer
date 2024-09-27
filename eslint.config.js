import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",  // Intégration avec Prettier
    },
    languageOptions: {
      ecmaVersion: 2021,  // Utilise ECMAScript 2021
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly", 
      },
    },
  },
];
