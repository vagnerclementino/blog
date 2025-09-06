module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    __PATH_PREFIX__: "readonly",
    __BASE_PATH__: "readonly",
    __ASSET_PREFIX__: "readonly",
  },
  rules: {
    "no-console": "error",
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
    }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "eqeqeq": "error",
    "prefer-const": "error",
    "complexity": ["warn", 10],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: [
        "**/*.test.{js,jsx}",
        "**/__tests__/**/*.{js,jsx}",
        "**/__mocks__/**/*.js",
        "**/loadershim.js"
      ],
      plugins: ["jest"],
      env: {
        jest: true,
      },
      rules: {
        "no-unused-vars": "off",
      },
    },
    {
      files: ["gatsby-*.{js,mjs}", "*.config.{js,mjs}", "gulpfile.js"],
      env: {
        node: true,
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
  ],
  ignorePatterns: [
    "node_modules/",
    "public/",
    ".cache/",
    "coverage/",
  ],
};
