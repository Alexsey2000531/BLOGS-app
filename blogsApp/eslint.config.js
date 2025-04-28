import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import typescriptParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import nodePlugin from 'eslint-plugin-node'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      node: nodePlugin,
      import: importPlugin,
      'jsx-a11y': eslintPluginJsxA11y,
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-magic-numbers': 'off',
      'prefer-const': 'error',
      'no-unused-vars': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['sibling', 'parent']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
          distinctGroup: true,
          named: false,
          warnOnUnassignedImports: false,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-assertions': 2,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react/react-in-jsx-scope': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'no-console': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-undef': ['error', { typeof: true }],

      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@BLOGS/backend/**',
            },
          ],
          patterns: [
            {
              group: [
                '@BLOGS/backend/**',
                '!@BLOGS/backend/**/',
                '!@BLOGS/backend/**/input',
                '!@BLOGS/backend/src/utils/canBlockedPost',
                '!@BLOGS/backend/src/lib/error',
              ],
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.node.json',
      },
    },
  },
]
