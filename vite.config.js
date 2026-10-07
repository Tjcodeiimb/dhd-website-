import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api/* to live Cloudflare Worker (or local worker if VITE_API_BACKEND is set)
      '/api': {
        target: process.env.VITE_API_BACKEND || 'https://dhandha-api.gauravkalal134.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
