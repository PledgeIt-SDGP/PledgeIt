import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'; // Separate React-related dependencies
            if (id.includes('tailwindcss')) return 'tailwind-vendor'; // Tailwind-specific chunk
            return 'vendor'; // General vendor chunk
          }
          if (id.includes('pages/vol')) return 'volunteer-pages';
          if (id.includes('pages/org')) return 'organization-pages';
          if (id.includes('components')) return 'shared-components'; // Extract common components
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Reduce the warning limit to better track large chunks
    sourcemap: false, // Disable source maps in production for better performance
    assetsInlineLimit: 8192, // Increase the inline asset size limit for small images
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['tailwindcss'], // Tailwind is used in the build, so pre-bundling it isn't necessary
  }
})
