import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import uno from 'unocss/vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        vue(),
        uno({
            configFile: path.join(dirname, 'uno.config.ts'),
            mode: 'vue-scoped'
        })
    ]
});
