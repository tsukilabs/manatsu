/// <reference types="vite/client" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.js';
          case 'cjs':
            return 'index.cjs';
          default:
            throw new Error(`Invalid format: ${format}`);
        }
      }
    },
    rollupOptions: {
      external: ['vue']
    }
  }
});
