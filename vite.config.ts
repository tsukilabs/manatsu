import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import manatsu from './src/plugins/vite';
import { ManatsuDark } from './src/themes/manatsu-dark';

export default defineConfig({
    plugins: [vue(), manatsu(ManatsuDark)],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Manatsu',
            fileName: 'manatsu',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
