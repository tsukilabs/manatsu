import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: false,
    environment: 'jsdom',
    browser: {
      name: 'chrome',
      enabled: false,
      headless: true
    },
    watch: false,
    coverage: {
      provider: 'istanbul',
      reporter: ['html']
    }
  }
});
