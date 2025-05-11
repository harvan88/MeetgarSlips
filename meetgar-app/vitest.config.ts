import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['asistente-ia/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@asistente': path.resolve(__dirname, 'asistente-ia'),
    },
  },
})
