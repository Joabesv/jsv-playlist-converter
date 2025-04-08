import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { z } from 'zod';

/**
 * Fixes issue with "__dirname is not defined in ES module scope"
 * https://flaviocopes.com/fix-dirname-not-defined-es-module-scope
 *
 * This is only necessary when using vite with `--configLoader runner`.
 * We use this option to allow for importing TS files from monorepos.
 * https://vite.dev/config/#configuring-vite
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envSchema = z.object({
  PUBLIC_WEB_URL:  z.string().url().optional().default('http://localhost:3035'),
  /**
   * Set this if you want to run or deploy your app at a base URL. This is
   * usually required for deploying a repository to Github/Gitlab pages.
   */
  PUBLIC_BASE_PATH:  z.string().optional().default('/'),
  BASE_URL: z.string().url().default('http://localhost:5005')
});

const env = envSchema.parse(process.env);
const webUrl = new URL(env.PUBLIC_WEB_URL);
const host = webUrl.hostname;
const port = parseInt(webUrl.port, 10);

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: env.PUBLIC_BASE_PATH,
  envPrefix: 'PUBLIC_',
  server: {
    host,
    port,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['@jsv-pc/ui']
  }
})
