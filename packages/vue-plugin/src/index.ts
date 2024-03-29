import type { Plugin } from 'vue';
import { injectStrict, setGlobalManatsu, symbols } from '@manatsu/shared';
import { isDarkMode, provide } from './provide';
import type { ManatsuOptions, ManatsuPluginGlobal } from './types';

export type * from './types';

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      provide(app, options);

      // Using `any` so we can let `$mana` remain read-only.
      (app.config.globalProperties.$mana as any) = createGlobalProps();

      setGlobalManatsu({ app });
    }
  };

  return manatsu;
}

function createGlobalProps(): ManatsuPluginGlobal {
  const mana: ManatsuPluginGlobal = {
    isDarkMode,
    setDarkMode: (darkMode) => {
      const darkModeRef = injectStrict(symbols.darkMode);
      darkModeRef.value = darkMode;
    },
    toggleDarkMode: () => {
      const darkModeRef = injectStrict(symbols.darkMode);
      darkModeRef.value = !darkModeRef.value;
    }
  };

  return mana;
}
