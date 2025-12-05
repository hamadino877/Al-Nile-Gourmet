import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: './',
    define: {
      // تم تحديث المفتاح بالمفتاح الجديد الذي أرسلته
      'process.env.API_KEY': JSON.stringify("AIzaSyCbzfwAy2LjSM6hqBy7w3TLC6ugI45k0mA"),
    },
    build: {
      chunkSizeWarningLimit: 1600,
    }
  }
})
