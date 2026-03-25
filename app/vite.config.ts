import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 워크스페이스 패키지 경로 매핑
      '@browseros/core': path.resolve(__dirname, '../packages/browseros-core/src'),
      '@browseros/svelte': path.resolve(__dirname, '../packages/browseros-svelte/src'),
      '@browseros/shared': path.resolve(__dirname, '../packages/browseros-shared/src'),
    },
    preserveSymlinks: true
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {}
})
