import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    watch: false,
    pool: 'forks',
    isolate: false,
    server: {
      deps: {
        external: [/^@mui\/(icons-material|material)/],
      },
    },
  },
});
