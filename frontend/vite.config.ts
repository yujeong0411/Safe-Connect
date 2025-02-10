import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('Proxy Error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Sending Request:', {
                method: req.method,
                url: req.url,
                headers: proxyReq.getHeaders()
              });
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('Received Response:', {
                statusCode: proxyRes.statusCode,
                url: req.url,
                headers: proxyRes.headers
              });
            });
        }
        },
      },
    },
  };
});
