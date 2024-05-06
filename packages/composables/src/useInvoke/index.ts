import { invoke } from '@tauri-apps/api/core';
import type { Nullish } from '@tb-dev/utility-types';
import type { UseInvokeOptions, UseInvokeReturn } from './types';
import { tryOnScopeDispose, watchTriggerable } from '@vueuse/core';
import { type ErrorHandler, getCurrentApp, handleError } from '@manatsu/shared';
import { type MaybeRefOrGetter, type Ref, isRef, ref, shallowRef, toRef, toValue } from 'vue';

export type { UseInvokeOptions, UseInvokeReturn } from './types';

export function useInvoke<Data>(
  command: MaybeRefOrGetter<string>,
  initial: Data,
  options: UseInvokeOptions<Data> = {}
): UseInvokeReturn<Data> {
  const { deep = false, lazy = false, loading, shallow = true, transform } = options;

  let id: symbol | null = null;
  const commandRef = toRef(command);
  const argsRef = toRef(options.args);
  const state = shallow ? shallowRef(initial) : ref(initial);

  const { stop: stopWatcher, trigger } = watchTriggerable(
    [commandRef, argsRef],
    async () => {
      const current = Symbol('useInvoke');
      id = current;

      try {
        if (isRef(loading)) {
          loading.value = true;
        }

        let result = await invoke<Data>(toValue(command), toValue(argsRef) ?? undefined);
        if (transform) result = await transform(result);

        if (current === id) {
          state.value = result;
        }
      } catch (err) {
        onError(options.onError, err);
      } finally {
        if (isRef(loading) && current === id) {
          loading.value = false;
        }
      }
    },
    {
      deep,
      immediate: !lazy
    }
  );

  function stop() {
    stopWatcher();
    id = null;
  }

  tryOnScopeDispose(() => stop());

  return {
    state: state as Ref<Data>,
    execute: trigger,
    stop
  };
}

function onError(fn: Nullish<ErrorHandler>, err: unknown) {
  if (fn) {
    fn.call(getCurrentApp(), err);
  } else {
    handleError(err);
  }
}
