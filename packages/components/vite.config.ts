import { join } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  root: __dirname,
  plugins: [vue(), dts({ rollupTypes: true, declarationOnly: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: join(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue']
    }
  }
});
