module.exports = {
  env: {
    node: true
  },
  extends: [
    'oclif',
    'oclif-typescript'
  ],
  rules: {
    'indent': ['error', 2],
    'yoda': ['error', 'always'],
    'quote-props': ['error', 'consistent-as-needed'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'node/no-missing-import': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/import-style': ['error', {
      styles: {
        path: { namespace: true, named: true }
      }
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }]
  }
}
