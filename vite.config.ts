import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

const isAnalyze = process.env['ANALYZE'] === 'true'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    isAnalyze &&
      visualizer({
        filename: 'dist/bundle-report.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@router': path.resolve(__dirname, './src/router'),
      '@services': path.resolve(__dirname, './src/services'),
      '@features': path.resolve(__dirname, './src/features'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@atoms': path.resolve(__dirname, './src/shared/components/atoms'),
      '@molecules': path.resolve(__dirname, './src/shared/components/molecules'),
      '@organisms': path.resolve(__dirname, './src/shared/components/organisms'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
