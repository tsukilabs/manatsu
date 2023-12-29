import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    watch: false,
    globals: false,
    environment: 'jsdom',
    include: [
      'packages/components/**/*.test.ts',
      'packages/composables/**/*.test.ts'
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['html'],
      include: ['packages/components/*', 'packages/composables/*']
    }
  }
});
