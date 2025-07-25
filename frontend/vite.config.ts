import { defineConfig } from 'vite'
import path from "node:path";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/be": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/be/, ''),
      },
    },
  },
})
