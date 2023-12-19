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
  plugins: ['react-refresh'],
  rules: {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
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
    ]
  }
};
