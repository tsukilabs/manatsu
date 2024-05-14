import type { App, Plugin } from 'vue';
import { saveLog } from '@manatsu/tauri-plugin/src/index.ts';
import {
  type ErrorHandler,
  type ErrorHandlerOptions,
  handleError,
  setGlobalManatsu
} from '@manatsu/shared';

export interface ManatsuOptions {
  errorHandler?: ErrorHandler;
  errorHandlerOptions?: ErrorHandlerOptions;
}

export function createManatsu(options: ManatsuOptions = {}): Plugin {
  const manatsu: Plugin = {
    install(app) {
      const errorHandler = (options.errorHandler ?? defaultErrorHandler).bind(app);
      app.config.errorHandler = (err) => handleError(err, options.errorHandlerOptions);

      setGlobalManatsu({
        app,
        errorHandler,
        errorHandlerOptions: options.errorHandlerOptions
      });
    }
  };

  return manatsu;
}

function defaultErrorHandler(this: App, err: unknown) {
  void saveLog({
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'Error',
    stack: err instanceof Error ? err.stack : null,
    version: { vue: this.version }
  });
}
