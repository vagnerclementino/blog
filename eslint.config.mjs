import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        __PATH_PREFIX__: "readonly",
        __BASE_PATH__: "readonly",
        __ASSET_PREFIX__: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true 
      }],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off", // Permite aspas simples em texto
      "react/display-name": "off", // Não obriga display name em componentes
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Configuração específica para arquivos de teste e mocks
  {
    files: [
      "**/*.test.{js,jsx}", 
      "**/__tests__/**/*.{js,jsx}",
      "**/__mocks__/**/*.js",
      "**/loadershim.js"
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off", // Mais flexível em testes
    },
  },
  // Configuração específica para arquivos de configuração
  {
    files: ["gatsby-*.{js,mjs}", "*.config.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true 
      }],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "public/**",
      ".cache/**",
    ],
  },
];
