module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  plugins: ['react-hooks'],
  ignorePatterns: ['node_modules/**', 'lib/**', 'dist/**', '**/*.log'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': 'warn',
  },
};
