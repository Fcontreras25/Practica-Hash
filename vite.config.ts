import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Generar el build en la carpeta dist
    emptyOutDir: true, // Limpiar dist antes del build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom'], // Dividir los módulos comunes
        },
      },
    },
  },
  server: {
    open: true, // Abrir automáticamente en el navegador al iniciar el servidor
    port: 3000, // Configurar el puerto de desarrollo
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.*$/, '/index.html'), // Redirigir todas las rutas a index.html
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para acceder a recursos en src
    },
  },
});
