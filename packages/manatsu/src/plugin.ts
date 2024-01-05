import { type Plugin, ref } from 'vue';
import { type ManatsuOptions, darkModeKey } from '@manatsu/shared';

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const darkMode = ref(options.darkMode ?? 'auto');
      app.provide(darkModeKey, darkMode);
    }
  };

  return manatsu;
}
