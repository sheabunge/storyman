module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'oclif',
    'oclif-typescript'
  ],
  rules: {
    'indent': ['error', 2],
    'yoda': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'node/no-missing-import': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/filename-case': ['error', { 'case': 'camelCase' }],
    'unicorn/import-style': ['error', {
      'styles': {
        'path': { 'namespace': true, 'named': true }
      }
    }],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }]
  }
}
