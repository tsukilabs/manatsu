import { type InvokeArgs, invoke } from '@tauri-apps/api/core';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import { extendRef, tryOnScopeDispose, watchTriggerable } from '@vueuse/core';
import { type MaybeRefOrGetter, type Ref, isRef, ref, shallowRef, toRef, toValue } from 'vue';
import {
  type ErrorHandler,
  type MaybeNullishRef,
  getCurrentApp,
  handleError
} from '@manatsu/shared';

export interface UseInvokeOptions<Data> {
  /** Arguments to pass to the command. */
  readonly args?: MaybeNullishRef<InvokeArgs>;
  /** @default true */
  readonly lazy?: boolean;
  /** @default true */
  readonly shallow?: boolean;

  /** A ref to indicate if the command is currently loading. */
  readonly loading?: Ref<boolean>;

  readonly onError?: Nullish<ErrorHandler>;
  readonly transform?: (value: Data) => MaybePromise<Data>;
}

export type UseInvokeReturn<Data> = Ref<Data> & {
  readonly execute: () => Promise<void>;
};

export function useInvoke<Data>(
  command: MaybeRefOrGetter<string>,
  initial: Data,
  options: UseInvokeOptions<Data> = {}
) {
  let id = Symbol('useInvoke');
  const commandRef = toRef(command);
  const argsRef = toRef(options.args);
  const state = options.shallow ? shallowRef(initial) : ref(initial);

  const { stop, trigger } = watchTriggerable(
    [commandRef, argsRef],
    async () => {
      const current = Symbol('useInvoke');
      id = current;

      try {
        if (isRef(options.loading)) {
          options.loading.value = true;
        }

        let result = await invoke<Data>(toValue(command), toValue(argsRef) ?? undefined);
        if (options.transform) result = await options.transform(result);

        if (current === id) {
          state.value = result;
        }
      } catch (err) {
        onError(options.onError, err);
      } finally {
        if (isRef(options.loading) && current === id) {
          options.loading.value = false;
        }
      }
    },
    {
      deep: false,
      immediate: !options.lazy
    }
  );

  tryOnScopeDispose(stop);

  return extendRef(state, { execute: trigger }) as UseInvokeReturn<Data>;
}

function onError(fn: Nullish<ErrorHandler>, err: unknown) {
  if (fn) {
    fn.call(getCurrentApp(), err);
  } else {
    handleError(err);
  }
}
