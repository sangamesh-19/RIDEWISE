import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    needsInterop: [
      '@mapbox/mapbox-gl-directions'
      // Add any other modules that require interop here
    ]
  },

})
