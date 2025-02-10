import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { ClientRequest, IncomingMessage } from 'http';
import type { ProxyOptions } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration constants
const CONFIG = {
  currentDateTime: '2025-02-09 18:01:12',
  currentUser: 'alirezamirehe',
  apiUrls: {
    guardian: process.env.VITE_GUARDIAN_API_URL || 'https://content.guardianapis.com',
    newsApi: process.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2',
    nyTimes: process.env.VITE_NY_TIMES_API_URL || 'https://api.nytimes.com/svc'
  }
} as const;

// Proxy configuration type
interface ExtendedProxyOptions extends ProxyOptions {
  configure?: (proxy: any, options: ProxyOptions) => void;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/guardian-api': {
        target: CONFIG.apiUrls.guardian,
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/guardian-api/, ''),
        configure: (proxy) => {
          // Error event
          proxy.on('error', (err: Error) => {
            console.log('Proxy Error:', err);
          });

          // Request event
          proxy.on('proxyReq', (_proxyReq: ClientRequest, req: IncomingMessage) => {
            console.log('Outgoing Request:', req.method, req.url);
          });

          // Response event
          proxy.on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage) => {
            console.log('Incoming Response:', {
              statusCode: proxyRes.statusCode,
              url: req.url,
              headers: proxyRes.headers
            });
          });
        },
      } as ExtendedProxyOptions,
      '/newsapi': {
        target: CONFIG.apiUrls.newsApi,
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/newsapi/, ''),
      },
      '/nytimes': {
        target: CONFIG.apiUrls.nyTimes,
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/nytimes/, ''),
      },
    },
  },
  envPrefix: 'VITE_',
  define: {
    __CURRENT_DATETIME__: JSON.stringify(CONFIG.currentDateTime),
    __CURRENT_USER__: JSON.stringify(CONFIG.currentUser)
  }
});