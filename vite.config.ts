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
        target: 'https://connect.garmin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/garmin/, ''),
      },
      '/api/todoist': {
        target: 'https://api.todoist.com/rest/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/todoist/, ''),
      },
    },
  },
})
