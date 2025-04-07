import { restrictEnvAccess } from '@jsv-pc/eslint-config/base';
import vueConfig from '@jsv-pc/eslint-config/vue';

/** @type {import("eslint").Linter.Config} */
export default [
  ...vueConfig,
  ...restrictEnvAccess,
  {
    files: ['vite.config.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
];
