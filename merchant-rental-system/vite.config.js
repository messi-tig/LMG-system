import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // allows @/ imports
    },
  },

  server: {
    port: 5173, // you can change if needed
    open: false, // disable auto-open to avoid spawn EPERM on Windows
    hmr: {
      overlay: true, // show errors in browser overlay
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
