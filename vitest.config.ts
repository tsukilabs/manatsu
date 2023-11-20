import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: false,
        browser: {
            name: 'chrome',
            enabled: true,
            headless: true
        },
        watch: false,
        coverage: {
            provider: 'istanbul',
            reporter: ['html']
        }
    }
});
