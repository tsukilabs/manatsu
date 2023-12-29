import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: __dirname,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false
  }
});
