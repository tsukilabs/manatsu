import { type InvokeArgs, invoke } from '@tauri-apps/api/core';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import { extendRef, tryOnScopeDispose, watchTriggerable } from '@vueuse/core';
import { type MaybeRefOrGetter, type Ref, isRef, ref, shallowRef, toRef, toValue } from 'vue';
import {
  type ErrorHandler,
  type MaybeNullishRef,
  getGlobalManatsu,
  handleError
} from '@manatsu/shared';

type CommandRecord = Record<string, string>;

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

/**
 * Define a composable function to invoke a Tauri command.
 * @param commands The commands that can be invoked.
 */
export function defineInvoke<T extends CommandRecord>(commands: T) {
  return function <Data>(
    command: MaybeRefOrGetter<keyof T>,
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

          const cmd = commands[toValue(commandRef as Ref<keyof T>)];
          if (typeof cmd !== 'string' || cmd.length === 0) {
            throw new TypeError(`invalid command: ${cmd}`);
          }

          let result = await invoke<Data>(cmd, toValue(argsRef) ?? void 0);
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
        deep: true,
        immediate: !options.lazy
      }
    );

    tryOnScopeDispose(stop);

    return extendRef(state, { execute: trigger }) as UseInvokeReturn<Data>;
  };
}

function onError(fn: Nullish<ErrorHandler>, err: unknown) {
  if (fn) {
    fn.call(getGlobalManatsu().app, err);
  } else {
    handleError(err);
  }
}
