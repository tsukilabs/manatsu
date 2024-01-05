import { type Plugin, ref } from 'vue';
import { darkModeKey } from '@manatsu/shared/src/symbol.ts';
import type { ManatsuOptions } from '@manatsu/shared/src/types.ts';

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const darkMode = ref(options.darkMode ?? 'auto');
      app.provide(darkModeKey, darkMode);
    }
  };

  return manatsu;
}
