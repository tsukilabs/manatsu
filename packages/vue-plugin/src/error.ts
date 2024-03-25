import type { App } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';
import { saveErrorLog } from '@manatsu/tauri-plugin/src/index.ts';
import {
  type ErrorHandler,
  type ErrorLog,
  type VersionSnapshot,
  privateSymbols
} from '@manatsu/shared';

export function provideErrorHandler(app: App, errorHandler?: Nullish<ErrorHandler>) {
  const fn = (errorHandler ?? defaultErrorHandler).bind(app);
  app.config.errorHandler = fn;
  app.provide(privateSymbols.errorHandler, fn);
}

function defaultErrorHandler(this: App, err: unknown) {
  const version: VersionSnapshot = { vue: this.version };
  const log: ErrorLog = {
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'Error',
    stack: err instanceof Error ? err.stack : null,
    timestamp: null,
    version
  };

  void saveErrorLog(log);

  console.error(err);
}
