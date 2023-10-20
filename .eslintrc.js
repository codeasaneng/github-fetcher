module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'max-len': ['error', { 'code': 80 }],
    'indent': ['error', 2],
  }
};

