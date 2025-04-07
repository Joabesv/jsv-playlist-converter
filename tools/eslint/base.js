/// <reference types="./types.d.ts" />

import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboConfig from 'eslint-config-turbo/flat';
import eslintPluginImport from 'eslint-plugin-import';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';

export const restrictEnvAccess = tseslint.config(
  { ignores: ['**/env.ts', 'dist/**'] },
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Avoid using process.env directly - validate your types with valibot (example in ./apps/server/env.ts)',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          name: 'process',
          importNames: ['env'],
          message:
            'Avoid using process.env directly - validate your types with zod (example in ./apps/server/env.ts)',
        },
      ],
      'consistent-type-imports': 'error'
    },
  },
);


export default tseslint.config([
  { ignores: ['dist/**'] },
  ...turboConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/no-cycle': 'warn',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'type',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
  {
    rules: {
      semi: ['error', 'always'],
    },
  },
]);
