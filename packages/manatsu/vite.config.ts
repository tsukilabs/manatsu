import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: __dirname,
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.mjs';
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
