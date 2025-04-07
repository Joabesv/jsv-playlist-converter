import { restrictEnvAccess } from '@jsv-pc/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...restrictEnvAccess,
  {
    rules: {
      'no-restricted-properties': 'off',
    },
  },
];
