import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: [
        'src/api.ts',
        'src/utils.ts',
        'src/permissions.ts',
        'src/store/index.ts',
        'src/router/guards.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        branches: 75,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    environment: 'node',
    restoreMocks: true,
  },
})
