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

  server: {
    host: '0.0.0.0', // Allows access from other devices on the same network
    port: 3000,      // Change this to your preferred port if needed
  }
})
