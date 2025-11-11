// @ts-check

import globals from 'globals'
import oclif from 'eslint-config-oclif'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  oclif,
  {
    ignores: ['dist/', 'bin/']
  },
  {
    languageOptions: {
      ecmaVersion: 2018,
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: [
            'eslint.config.mjs',
            'test/*.ts',
            'test/commands/*.test.ts'
          ]
        }
      }
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/lines-between-class-members': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'comma-dangle': ['error', 'never'],
      'indent': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'node/no-missing-import': 'off',
      'object-curly-spacing': ['error', 'always'],
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-union-types': 'off',
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
      'unicorn/import-style': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/switch-case-braces': 'off',
      'yoda': ['error', 'always']
    }
  },
  {
    files: [
      'src/commands/**/*',
      'src/utils/**/*',
      'src/hooks/**/*',
      'test/commands/**/*',
      'test/utils.ts',
      '*.mjs'
    ],
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }]
    }
  }
)
