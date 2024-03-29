import type { App, Plugin } from 'vue';
import { setGlobalManatsu } from '@manatsu/shared';
import type { ManatsuOptions, ManatsuPluginGlobal } from './types';
import { isDarkMode, provide, setDarkMode, toggleDarkMode } from './provide';

export type * from './types';

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      provide(app, options);
      setGlobalProps(app);
      setGlobalManatsu({ app });
    }
  };

  return manatsu;
}

function setGlobalProps(app: App) {
  const mana: ManatsuPluginGlobal = {
    isDarkMode,
    setDarkMode,
    toggleDarkMode
  };

  // Using `any` so we can let `$mana` remain read-only.
  (app.config.globalProperties.$mana as any) = mana;
}
