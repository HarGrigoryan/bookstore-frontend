import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Proxy API requests to backend to avoid CORS / HTML parse issues
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // '/book-instances': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   secure: false,
      // },
      // '/authors': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   secure: false
      // },
      // '/auth': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   secure: false
      // },
      // '/languages': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   secure: false
      // }
    },
  },
});
