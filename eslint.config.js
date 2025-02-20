import js from '@eslint/js'
import standardWithTypescript from 'eslint-config-standard-with-typescript'
import prettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-node'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  standardWithTypescript,
  prettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      node: nodePlugin,
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
          orderImportKind: 'asc',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': [
        'error',
        {
          skipTemplates: true,
          skipStrings: true,
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['info', 'error', 'warn'],
        },
      ],
      'node/no-process-env': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MetaProperty[property.name=env]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
]
