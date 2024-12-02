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
    port: 3001, // Cambiar el puerto para evitar conflictos
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para acceder a recursos en src
    },
  },
});
