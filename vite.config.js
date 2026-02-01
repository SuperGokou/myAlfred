import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Forces IPv4 (Fixes Windows EACCES error)
    port: 3000,        // Standard React port
  }
})