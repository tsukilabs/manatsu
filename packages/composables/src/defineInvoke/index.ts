import type { Nullish } from '@tb-dev/utility-types';
import { type InvokeArgs, invoke } from '@tauri-apps/api/tauri';
import { extendRef, tryOnScopeDispose, watchTriggerable } from '@vueuse/core';
import { type ErrorHandler, type MaybeNullishRef, privateSymbols } from '@manatsu/shared';
import {
  type App,
  type MaybeRefOrGetter,
  type Ref,
  inject,
  isRef,
  ref,
  shallowRef,
  toRef,
  toValue
} from 'vue';

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
  readonly transform?: (value: Data) => Data;
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

          const result = await invoke<Data>(cmd, toValue(argsRef) ?? void 0);
          if (current === id) {
            if (options.transform) {
              state.value = options.transform(result);
            } else {
              state.value = result;
            }
          }
        } catch (err) {
          onError(options, err);
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

function onError(options: UseInvokeOptions<unknown>, err: unknown) {
  // @ts-expect-error - No typings for __MANATSU__
  const app: App = globalThis.__MANATSU__.app;

  let fn = options.onError;
  fn ??= app.runWithContext(() => {
    return inject(privateSymbols.errorHandler);
  });

  fn?.call(app, err);
}
