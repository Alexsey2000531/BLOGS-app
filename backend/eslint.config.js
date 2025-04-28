import js from '@eslint/js'
import path from 'path'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import pluginImport from 'eslint-plugin-import'

const testDir = path.resolve('./src/test')
const srcDir = path.resolve('./src')

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: pluginImport,
    },
    rules: {
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
      'no-console': 'error',
      'no-undef': ['warn'],
    },
  },

  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.integration.test.ts'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: srcDir,
              from: testDir,
              message: 'Импортировать что-либо из тестового каталога можно только внутри интеграционных тестов!',
            },
          ],
        },
      ],
    },
  },
]
