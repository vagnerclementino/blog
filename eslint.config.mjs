import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,jsx}"],
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
      // === REGRAS BÁSICAS DO JAVASCRIPT ===

      // Avisa sobre uso de console.log (pode ser removido em produção)
      // https://eslint.org/docs/latest/rules/no-console
      "no-console": "warn",

      // Avisa sobre variáveis não utilizadas (permite prefixo _ para ignorar)
      // https://eslint.org/docs/latest/rules/no-unused-vars

      "no-unused-vars": ["error", {
        "vars": "all",
        "args": "after-used",
        "caughtErrors": "all",
        "ignoreRestSiblings": false,
        "ignoreUsingDeclarations": false,
        "reportUsedIgnorePattern": false
      }],

      // === REGRAS DO REACT ===

      // Desabilita obrigatoriedade de prop-types (usando TypeScript ou não é necessário)
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
      "react/prop-types": "off",

      // Desabilita obrigatoriedade de importar React (React 17+ não precisa)
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
      "react/react-in-jsx-scope": "off",

      // Permite aspas simples e caracteres especiais em JSX (útil para blogs)
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
      "react/no-unescaped-entities": "off",

      // Não obriga display name em componentes (opcional para componentes anônimos)
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
      "react/display-name": "off",

      // === REGRAS DO REACT HOOKS ===

      // OBRIGATÓRIO: Garante que hooks sejam chamados na ordem correta
      // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
      "react-hooks/rules-of-hooks": "error",

      // Avisa sobre dependências faltantes em useEffect, useMemo, etc.
      // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
      "react-hooks/exhaustive-deps": "warn",

      // === REGRAS COMENTADAS PARA ANÁLISE POSTERIOR ===

      // Força uso de === ao invés de ==
      // https://eslint.org/docs/latest/rules/eqeqeq
      // "eqeqeq": "error",

      // Proíbe uso de var (prefere let/const)
      // https://eslint.org/docs/latest/rules/no-var
      // "no-var": "error",

      // Prefere const quando variável não é reatribuída
      // https://eslint.org/docs/latest/rules/prefer-const
      // "prefer-const": "error",

      // Força ponto e vírgula no final das linhas
      // https://eslint.org/docs/latest/rules/semi
      // "semi": ["error", "always"],

      // Força aspas simples ou duplas consistentemente
      // https://eslint.org/docs/latest/rules/quotes
      // "quotes": ["error", "single"],

      // Controla vírgula no final de objetos/arrays
      // https://eslint.org/docs/latest/rules/comma-dangle
      // "comma-dangle": ["error", "always-multiline"],

      // Força espaçamento consistente
      // https://eslint.org/docs/latest/rules/indent
      // "indent": ["error", 2],

      // Limita complexidade ciclomática das funções
      // https://eslint.org/docs/latest/rules/complexity
      // "complexity": ["warn", 10],

      // Limita número máximo de linhas por função
      // https://eslint.org/docs/latest/rules/max-lines-per-function
      // "max-lines-per-function": ["warn", 50],

      // === REGRAS REACT COMENTADAS ===

      // Força ordem específica dos métodos em componentes de classe
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
      // "react/sort-comp": "error",

      // Proíbe uso de índice como key em listas
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
      // "react/no-array-index-key": "warn",

      // Força uso de Fragment ao invés de div desnecessária
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
      // "react/jsx-fragments": ["error", "syntax"],

      // Controla espaçamento em props JSX
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
      // "react/jsx-props-no-multi-spaces": "error",

      // === REGRAS DE ACESSIBILIDADE (JSX-A11Y) COMENTADAS ===

      // Força alt text em imagens
      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
      // "jsx-a11y/alt-text": "error",

      // Valida âncoras (links)
      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
      // "jsx-a11y/anchor-is-valid": "error",

      // Força labels em inputs
      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
      // "jsx-a11y/label-has-associated-control": "error",

      // Força roles ARIA válidos
      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
      // "jsx-a11y/role-has-required-aria-props": "error",
    },
    settings: {
      react: {
        version: "detect", // Detecta automaticamente a versão do React
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
        ...globals.jest, // Inclui todas as globais do Jest (describe, it, expect, etc.)
      },
    },
    rules: {
      // Mais flexível com variáveis não utilizadas em testes
      "no-unused-vars": "off",

      // === REGRAS DE TESTE COMENTADAS PARA ANÁLISE ===

      // Força uso de expect.assertions() em testes assíncronos
      // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md
      // "jest/expect-expect": "error",

      // Proíbe testes focados (fit, fdescribe)
      // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-focused-tests.md
      // "jest/no-focused-tests": "error",

      // Proíbe testes desabilitados (xit, xdescribe)
      // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-disabled-tests.md
      // "jest/no-disabled-tests": "warn",
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
      // Permite console.log em arquivos de configuração
      "no-console": "off",

      // Configuração mais flexível para variáveis não utilizadas
      "no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
    },
  },

  // Arquivos e diretórios ignorados pelo ESLint
  {
    ignores: [
      "node_modules/**",    // Dependências
      "public/**",          // Build output do Gatsby
      ".cache/**",          // Cache do Gatsby
      "coverage/**",        // Relatórios de cobertura de testes
    ],
  },
];
