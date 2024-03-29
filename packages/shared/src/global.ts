import { type App, inject } from 'vue';
import { type Router, routerKey } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';

const symbol: unique symbol = Symbol();
const map = new WeakMap<symbol, ManatsuGlobal>();

export interface ManatsuGlobal {
  readonly app: App;
}

function getGlobalManatsu(): ManatsuGlobal {
  const globalManatsu = map.get(symbol);
  if (!globalManatsu) {
    throw new Error('manatsu plugin must be installed');
  }

  return globalManatsu;
}

export function setGlobalManatsu(manatsu: ManatsuGlobal) {
  map.set(symbol, manatsu);
}

/**
 * Get the current app instance.
 * This should be called only after the manatsu plugin has been installed.
 */
export function getCurrentApp(): App {
  return getGlobalManatsu().app;
}

/** Get the current router instance. */
export function getRouter(): Nullish<Router> {
  const app = getCurrentApp();

  // https://github.com/vuejs/router/blob/main/packages/router/src/injectionSymbols.ts
  return app.runWithContext(() => inject(routerKey));
}
