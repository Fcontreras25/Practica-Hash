import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Carpeta de salida para los archivos de construcción
    rollupOptions: {
      output: {
        manualChunks: {
          // Divide los módulos de node_modules para optimizar la carga
          vendor: ['react', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    open: true, // Abre automáticamente en el navegador al iniciar el servidor
    port: 3000, // Configura el puerto del servidor de desarrollo
  },
  resolve: {
    alias: {
      // Alias opcionales para rutas más cortas
      '@': '/src',
    },
  },
});
