import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config Vite para producción (Netlify)
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // base '/' explícito (útil si en algún momento se despliega bajo subpath cambiar aquí)
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      // Reducir riesgo de chunk gigante inicial
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom']
          }
        }
      }
    },
    // Asegura que imágenes jpg en public no causen warnings de MIME
    assetsInclude: ['**/*.jpg', '**/*.jpeg']
  }
})
