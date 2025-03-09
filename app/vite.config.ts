import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 워크스페이스 패키지 경로 매핑
      '@browseros/core': path.resolve(__dirname, '../packages/browseros-core/src'),
      '@browseros/react': path.resolve(__dirname, '../packages/browseros-react/src'),
      '@browseros/shared': path.resolve(__dirname, '../packages/browseros-shared/src'),
      '@browseros/note-app': path.resolve(__dirname, '../packages/note-app/src'),
      '@browseros/todo-app': path.resolve(__dirname, '../packages/todo-app/src'),
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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-router',
      '@remix-run/router'
    ]
  },
  define: {}
})
