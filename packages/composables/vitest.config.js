import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    watch: false,
    globals: false,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['html']
    }
  }
});
