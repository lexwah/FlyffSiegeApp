import { defineConfig, loadEnv } from 'vite';
import fs from 'fs-extra';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
// Hack to load environment variables. process.env does not expose the ones we define .env
const env = loadEnv('', process.cwd(), '');

let port = Number(env.VITE_PORT);
// eslint-disable-next-line no-restricted-globals
if (isNaN(port)) port = 3009;

const deployMode = env.DEPLOY_MODE || 'local';
const gtmId = env.GTM_ID || '';
const version = env.VERSION || '0.0';
console.log({ version });
const apiURL = deployMode === 'local' ? 'http://localhost:3001' : 'https://api.flyffsiege.com';

const appendGTM = (html: string) => {
  const gtmCode = `<script async src="https://www.googletagmanager.com/gtag/js?id=${gtmId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag(\'js\',new Date());gtag(\'config\',\'${gtmId}\');</script>`;
  return html.replace('<!--gtag-->', `${gtmCode}`);
};

const config = {
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
    'window.API_URL': `'${apiURL}'`,
    'process.env.VERSION': `"${version}"`
  },
  server: {
    port,
    hmr: {
      // Disable the error overlay for lint errors
      overlay: false,
    },
  },
};

if (deployMode !== 'local') {
  // rewrite the index.html file with appendGTM
  const html = fs.readFileSync('./index.html', 'utf8');
  fs.writeFileSync('./index.html', appendGTM(html));
}
// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(config);
