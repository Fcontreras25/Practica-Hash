import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Indica que los recursos están en la raíz
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom'], // Dividir los módulos comunes
        },
      },
    },
  },
  server: {
    open: true,
    port: 3001,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
