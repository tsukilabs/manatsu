import { defineConfig, mergeConfig } from 'vitest/config';
import vite from './vite.config';

export default mergeConfig(
    vite,
    defineConfig({
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
    })
);
