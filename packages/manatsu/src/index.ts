import './style/main.scss';
import { type Plugin, effectScope, ref, watchEffect } from 'vue';
import { tryOnScopeDispose, usePreferredDark } from '@vueuse/core';
import * as symbol from './symbol';
import { setDarkMode } from './plugin';

export * from './symbol';
export * from '@manatsu/components/src/index.ts';
export * from '@manatsu/composables/src/index.ts';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: boolean | 'auto';
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const darkMode = ref(options.darkMode ?? 'auto');
      const preferredDark = usePreferredDark();
      app.provide(symbol.darkModeKey, darkMode);

      /** @see https://github.com/vuejs/core/pull/8801 */
      /** @see https://github.com/vuejs/core/issues/8787 */
      const scope = effectScope();
      scope.run(() => {
        watchEffect(() => {
          if (darkMode.value === 'auto') {
            setDarkMode(preferredDark.value);
          } else {
            setDarkMode(darkMode.value);
          }
        });
      });

      app.runWithContext(() => {
        tryOnScopeDispose(() => {
          scope.stop();
        });
      });
    }
  };

  return manatsu;
}
