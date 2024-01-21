import { basename, join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import prettier from 'prettier';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';

const dtsOptions = {
  rollupTypes: true,
  afterBuild: async (map) => {
    const indexDts = Array.from(map).find(([filePath]) => {
      return basename(filePath) === 'index.d.ts';
    });

    if (!indexDts) {
      throw new Error('Could not find index.d.ts file.');
    }

    let [filePath, content] = indexDts;

    // https://regex101.com/r/LomJCS
    const packageRegex = /@manatsu\/([a-z]+)\/src\/index\.ts/gm;
    content = content.replace(packageRegex, './$1');

    if (!content.includes('ComponentCustomProperties')) {
      const moduleDeclaration = `
        declare module 'vue' {
          interface ComponentCustomProperties {
            readonly $mana: import("@manatsu/shared").ManatsuGlobal;
          }
        }
        
        export {}
      `;

      // https://regex101.com/r/ZIMPlK
      const emptyExportRegex = /export\s*{\s*};?/gm;
      content = content.replace(emptyExportRegex, moduleDeclaration);
    }

    content = await prettier.format(content, {
      parser: 'babel-ts',
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      endOfLine: 'lf',
      semi: true,
      singleQuote: false,
      trailingComma: 'none',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always'
    });

    await writeFile(filePath, content);
  }
};

export default defineConfig({
  root: __dirname,
  plugins: [vue(), dts(dtsOptions)],
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
      external: ['vue', 'vue-router', /^@vueuse\//, /^@tauri-apps\/api/],
      output: {
        chunkFileNames: '[name].js',
        manualChunks: {
          components: ['@manatsu/components/src/index.ts'],
          composables: ['@manatsu/composables/src/index.ts']
        }
      }
    }
  }
});
