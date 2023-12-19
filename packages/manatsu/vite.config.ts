import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: __dirname,
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', /^@vueuse\//],
      output: {
        chunkFileNames: '[name].js',
        manualChunks: {
          components: ['@manatsu/components/index.ts'],
          composables: ['@manatsu/composables/index.ts']
        }
      }
    }
  }
});
