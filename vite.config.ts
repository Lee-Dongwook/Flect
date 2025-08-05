import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
  },
  plugins: [],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      platform: resolve(__dirname, 'src/platform'),
    },
    extensions: ['.ts', '.tsx'],
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'platform/jsx-runtime',
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
