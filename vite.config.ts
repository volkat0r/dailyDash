import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/garmin': {
        target: 'http://localhost:3001',
        changeOrigin: false,
      },
      '/api/todoist': {
        target: 'https://api.todoist.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/todoist/, ''),
      },
    },
  },
})
