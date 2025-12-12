# ESLint Configuration
# Add to prevent linting errors if using ESLint

export default {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn'],
    'no-console': ['warn'],
  },
};
