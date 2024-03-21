import type { App } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';
import { ManatsuError } from './error';

export interface ManatsuGlobal {
  readonly app: App;
}

declare global {
  // eslint-disable-next-line no-inner-declarations, no-var, @typescript-eslint/naming-convention
  var __MANATSU__: Nullish<ManatsuGlobal>;
}

export function getGlobalManatsu(): ManatsuGlobal {
  const globalManatsu = globalThis.__MANATSU__;
  if (!globalManatsu) {
    throw new ManatsuError('manatsu plugin must be installed');
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
