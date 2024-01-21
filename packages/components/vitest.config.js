import vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
  plugins: [vue()],
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
