import { type Ref, readonly, ref, shallowRef } from 'vue';
import type { MaybePromise } from '@tb-dev/utility-types';
import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';

export interface UseInvokeOptions<D> {
  /** Arguments to pass to the command. */
  readonly args?: InvokeArgs;
  /** @default true */
  readonly immediate?: boolean;
  /** The initial value of the state. */
  readonly initial: D;
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
  return function <D>(command: keyof T, options: UseInvokeOptions<D>) {
    const {
      args = {},
      immediate = true,
      initial = null,
      resetOnExecute = true,
      shallow = true
    } = options;

    const state = shallow ? shallowRef(initial) : ref(initial);
    const isLoading = ref(false);

    async function execute() {
      try {
        isLoading.value = true;
        if (resetOnExecute) state.value = initial;
        state.value = await invoke<D>(commands[command], args);
      } catch (err) {
        await options.onError?.(err);
      } finally {
        isLoading.value = false;
      }
    }

    if (immediate) {
      execute().catch((err) => options.onError?.(err));
    }

    return {
      state: state as Ref<D>,
      isLoading: readonly(isLoading),
      execute
    };
  };
}
