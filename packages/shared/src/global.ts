import type { App } from 'vue';
import type { Router } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';

export interface ManatsuGlobal {
  readonly app: App;
  readonly router?: Router;
}

declare global {
  // eslint-disable-next-line no-inner-declarations, no-var, @typescript-eslint/naming-convention
  var __MANATSU__: Nullish<ManatsuGlobal>;
}

export function getGlobalManatsu(): ManatsuGlobal {
  const globalManatsu = globalThis.__MANATSU__;
  if (!globalManatsu) {
    throw new Error('manatsu plugin must be installed');
  }

  return globalManatsu;
}

export function setGlobalManatsu(manatsu: ManatsuGlobal) {
  globalThis.__MANATSU__ = manatsu;
}

/**
 * Get the current app instance.
 * This should be called only after the manatsu plugin has been installed.
 */
export function getCurrentApp(): App {
  return getGlobalManatsu().app;
}

/**
 * Get the current router instance.
 * This will throw if the router was not provided to the manatsu plugin.
 */
export function getRouter(): Router {
  const router = getGlobalManatsu().router;
  if (!router) {
    throw new Error('manatsu plugin was not initialized with a router');
  }

  return router;
}
