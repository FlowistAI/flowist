module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['unused-imports', 'react-refresh'],
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    "curly": ["error", "all"],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'none',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        }
      }
    ],
    'react-refresh/only-export-components': [
      'warn',
      { 'allowConstantExport': true }
    ],
    // padding line after import, export, if-else, loop, func
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'export' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'for' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'while' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'function' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'try' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'switch' },
      { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },
    ],
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    ]
  }
};
