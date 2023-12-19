import './assets/main.scss';
import { type Plugin, effectScope, ref, watchEffect } from 'vue';
import { tryOnScopeDispose, usePreferredDark } from '@vueuse/core';
import * as symbol from './symbol';

export * from './symbol';
export * from '@manatsu/components/index.ts';
export * from '@manatsu/composables/index.ts';

export interface ManatsuOptions {
  /** @default 'auto' */
  darkMode?: boolean | 'auto';
}

function setDarkMode(darkMode: boolean) {
  const body = document.body;
  let classes = (body.getAttribute('class') ?? '').split(' ');
  classes = classes.map((c) => c.trim()).filter(Boolean);

  const manatsuDark = 'manatsu-dark';
  if (darkMode && !classes.includes(manatsuDark)) {
    classes.push(manatsuDark);
  } else if (!darkMode && classes.includes(manatsuDark)) {
    classes.splice(classes.indexOf(manatsuDark), 1);
  }

  body.setAttribute('class', classes.join(' '));
}

export const manatsu: Plugin<ManatsuOptions> = {
  install(app, options = {}) {
    const darkMode = ref(options.darkMode ?? 'auto');
    const preferredDark = usePreferredDark();
    app.provide(symbol.darkModeKey, darkMode);

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

    tryOnScopeDispose(() => {
      scope.stop();
    });
  }
};
