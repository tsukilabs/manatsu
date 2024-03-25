import type { App } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import type { Nullish } from '@tb-dev/utility-types';
import { Command } from '@manatsu/tauri-plugin/src/index.ts';
import { type ErrorHandler, privateSymbols } from '@manatsu/shared';

interface Version {
  app?: Nullish<string>;
  manatsu?: Nullish<string>;
  tauri?: Nullish<string>;
  vue: string;
  webview?: Nullish<string>;
}

interface ErrorLog {
  message: string;
  name: string;
  stack?: Nullish<string>;
  timestamp?: Nullish<string>;
  version: Version;
}

export function provideErrorHandler(app: App, errorHandler?: Nullish<ErrorHandler>) {
  const fn = (errorHandler ?? defaultErrorHandler).bind(app);
  app.config.errorHandler = fn;
  app.provide(privateSymbols.errorHandler, fn);
}

function defaultErrorHandler(this: App, err: unknown) {
  const version: Version = { vue: this.version };
  const log: ErrorLog = {
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'Error',
    stack: err instanceof Error ? err.stack : null,
    timestamp: null,
    version
  };

  void invoke(Command.LogError, { log });

  console.error(err);
}
