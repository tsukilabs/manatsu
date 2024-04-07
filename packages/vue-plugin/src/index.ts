import type { App, Plugin } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';
import { saveErrorLog } from '@manatsu/tauri-plugin/src/index.ts';
import {
  type ErrorHandler,
  type ErrorLog,
  type VersionSnapshot,
  setGlobalManatsu,
  symbols
} from '@manatsu/shared';

export interface ManatsuOptions {
  errorHandler?: Nullish<ErrorHandler>;
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const fn = (options.errorHandler ?? defaultErrorHandler).bind(app);
      app.config.errorHandler = fn;
      app.provide(symbols.errorHandler, fn);

      setGlobalManatsu({ app });
    }
  };

  return manatsu;
}

function defaultErrorHandler(this: App, err: unknown) {
  const version: VersionSnapshot = { vue: this.version };
  const log: ErrorLog = {
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'Error',
    stack: err instanceof Error ? err.stack : null,
    version
  };

  void saveErrorLog(log);

  console.error(err);
}
