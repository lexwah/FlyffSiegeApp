import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
// Hack to load environment variables. process.env does not expose the ones we define .env
const env = loadEnv('', process.cwd(), '');

let port = Number(env.VITE_PORT);
// eslint-disable-next-line no-restricted-globals
if (isNaN(port)) port = 3009;

const deployMode = env.DEPLOY_MODE || 'local';
const apiURL = deployMode === 'local' ? 'http://localhost:3001' : 'https://api.flyffsiege.com';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  mode: 'development',
  build: {
    outDir: './build',
    minify: true,
  },
  plugins: [
    react({}),
    eslint({
      failOnError: false,
    }),
  ],
  resolve: {
    preserveSymlinks: true,
  },
  define: {
    'window.API_URL': `'${apiURL}'`
  },
  server: {
    port,
    hmr: {
      // Disable the error overlay for lint errors
      overlay: false,
    },
  },
});
