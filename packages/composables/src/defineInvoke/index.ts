import { ref, shallowRef } from 'vue';
import { extendRef } from '@vueuse/core';
import type { MaybePromise } from '@tb-dev/utility-types';
import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';

export interface UseInvokeOptions {
  /** Arguments to pass to the command. */
  readonly args?: InvokeArgs;
  /** @default true */
  readonly immediate?: boolean;
  /** @default true */
  readonly resetOnExecute?: boolean;
  /** @default true */
  readonly shallow?: boolean;

  readonly onError?: (error: unknown) => MaybePromise<void>;
}

/**
 * Define a composable function to invoke a Tauri command.
 * @param commands The commands that can be invoked.
 */
export function defineInvoke<T extends Record<string, string>>(commands: T) {
  return function <D>(command: keyof T, initial: D, options: UseInvokeOptions = {}) {
    const { args, immediate = true, resetOnExecute = true, shallow = true } = options;

    const state = shallow ? shallowRef(initial) : ref(initial);

    async function execute() {
      try {
        if (resetOnExecute) state.value = initial;
        state.value = await invoke<D>(commands[command], args);
      } catch (err) {
        await options.onError?.(err);
      }
    }

    if (immediate) {
      execute().catch((err) => options.onError?.(err));
    }

    return extendRef(state, { execute });
  };
}
