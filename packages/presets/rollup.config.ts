import { defineConfig } from 'rollup';
import dts from 'vite-plugin-dts';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
    plugins: [typescript(), dts({ rollupTypes: true })],
    external: ['unocss'],
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/presets.mjs',
            format: 'es',
            generatedCode: 'es2015'
        },
        {
            file: 'dist/presets.cjs',
            format: 'cjs',
            generatedCode: 'es2015'
        }
    ]
});
