import { extendRef } from '@vueuse/core';
import { type Ref, ref, shallowRef } from 'vue';
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

    async function execute() {
      try {
        if (resetOnExecute) state.value = initial;
        state.value = await invoke<Data>(commands[command], args);
      } catch (err) {
        await options.onError?.(err);
      }
    }

    if (immediate) {
      execute().catch((err) => options.onError?.(err));
    }

    return extendRef(state, { execute }) as UseInvokeReturn<Data>;
  };
}
