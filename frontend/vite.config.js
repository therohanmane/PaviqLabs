import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiOrigin = (env.VITE_API_URL || '').trim().replace(/\/+$/, '')
  const proxyTarget =
    devApiOrigin && /^https?:\/\//i.test(devApiOrigin)
      ? devApiOrigin.replace(/\/api$/i, '')
      : 'http://127.0.0.1:5000'

  return {
    plugins: [react()],

    base: './',

    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})