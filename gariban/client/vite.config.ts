import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true
  },
  base: '/'
}) 