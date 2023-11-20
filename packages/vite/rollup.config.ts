import { defineConfig } from 'rollup';
import dts from 'vite-plugin-dts';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
    input: 'src/index.ts',
    output: {
        file: 'dist/vite.js',
        format: 'es',
        generatedCode: 'es2015'
    },
    plugins: [typescript(), dts({ rollupTypes: true })],
    external: ['unocss/vite']
});
