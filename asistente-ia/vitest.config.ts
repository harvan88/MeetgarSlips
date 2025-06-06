import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      '@asistente': path.resolve(__dirname, '.')
    }
  }
})
