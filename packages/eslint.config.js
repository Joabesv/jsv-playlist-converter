import baseConfig from '@jsv-pc/eslint-config/base';
import vueConfig from '@jsv-pc/eslint-config/vue';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...vueConfig,
];
