import { type App, inject } from 'vue';
import { type Router, routerKey } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';

export interface ManatsuGlobal {
  readonly app: App;
}

function createScope() {
  let globalManatsu: ManatsuGlobal | null = null;

  function get(): ManatsuGlobal {
    if (!globalManatsu) {
      throw new Error('manatsu plugin must be installed');
    }

    return globalManatsu;
  }

  function set(manatsu: ManatsuGlobal) {
    globalManatsu = manatsu;
  }

  return { get, set };
}

const { get, set } = createScope();

export { set as setGlobalManatsu };

/**
 * Get the current app instance.
 * This should be called only after the manatsu plugin has been installed.
 */
export function getCurrentApp(): App {
  return get().app;
}

/** Get the current router instance. */
export function getRouter(): Nullish<Router> {
  const app = getCurrentApp();

  // https://github.com/vuejs/router/blob/main/packages/router/src/injectionSymbols.ts
  return app.runWithContext(() => inject(routerKey));
}
