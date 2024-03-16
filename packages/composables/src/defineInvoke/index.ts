import { extendRef } from '@vueuse/core';
import { type Ref, inject, ref, shallowRef } from 'vue';
import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import { type ErrorHandler, privateSymbols } from '@manatsu/shared';

export interface UseInvokeOptions {
  /** Arguments to pass to the command. */
  readonly args?: InvokeArgs;
  /** @default true */
  readonly immediate?: boolean;
  /** @default true */
  readonly resetOnExecute?: boolean;
  /** @default true */
  readonly shallow?: boolean;

  readonly onError?: Nullish<ErrorHandler>;
}

export type UseInvokeReturn<Data> = Ref<Data> & {
  readonly execute: () => MaybePromise<void>;
};

/**
 * Define a composable function to invoke a Tauri command.
 * @param commands The commands that can be invoked.
 */
export function defineInvoke<T extends Record<string, string>>(commands: T) {
  return function <Data>(command: keyof T, initial: Data, options: UseInvokeOptions = {}) {
    const { args, immediate = true, resetOnExecute = true, shallow = true } = options;

    const state = shallow ? shallowRef(initial) : ref(initial);

    const app = globalThis.__MANATSU__.app;
    let onError = options.onError;
    onError ??= app.runWithContext(() => {
      return inject(privateSymbols.errorHandler);
    });

    async function execute() {
      try {
        if (resetOnExecute) state.value = initial;
        state.value = await invoke<Data>(commands[command], args);
      } catch (err) {
        onError?.call(app, err);
      }
    }

    if (immediate) {
      execute().catch((err: unknown) => onError?.call(app, err));
    }

    return extendRef(state, { execute }) as UseInvokeReturn<Data>;
  };
}
