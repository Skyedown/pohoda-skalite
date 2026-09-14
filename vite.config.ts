import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    rollupOptions: {
      // index.pl.html is the Polish HTML shell — same JS/CSS chunks, different
      // lang attribute and meta tags so PL crawlers get it right on first byte.
      input: {
        main: resolve(__dirname, 'index.html'),
        pl: resolve(__dirname, 'index.pl.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
