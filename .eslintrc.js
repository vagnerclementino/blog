module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  plugins: [
    "react",
    "react-hooks", 
    "jsx-a11y",
    "jest"
  ],
  env: {
    browser: true,
    node: true,
    es2022: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    __PATH_PREFIX__: "readonly",
    __BASE_PATH__: "readonly", 
    __ASSET_PREFIX__: "readonly"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "no-console": "error",
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used", 
      "caughtErrors": "all",
      "ignoreRestSiblings": false,
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_",
      "reportUsedIgnorePattern": false
    }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "eqeqeq": "error",
    "prefer-const": "error",
    "complexity": ["warn", 10]
  },
  overrides: [
    {
      files: [
        "**/*.test.{js,jsx}",
        "**/__tests__/**/*.{js,jsx}",
        "**/__mocks__/**/*.js",
        "**/loadershim.js"
      ],
      rules: {
        "no-unused-vars": "off"
      }
    },
    {
      files: ["gatsby-*.{js,mjs}", "*.config.{js,mjs}", "gulpfile.js"],
      rules: {
        "no-console": "off",
        "no-unused-vars": ["warn", {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_", 
          ignoreRestSiblings: true
        }]
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "public/",
    ".cache/",
    "coverage/"
  ]
};
