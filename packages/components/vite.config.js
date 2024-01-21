import { join } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: __dirname,
  plugins: [vue(), dts({ rollupTypes: true })],
  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@vueuse/core', /^@tauri-apps\/api/]
    }
  }
});
