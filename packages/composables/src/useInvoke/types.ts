import type { Ref } from 'vue';
import type { InvokeArgs } from '@tauri-apps/api/core';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import type { ErrorHandler, MaybeNullishRef } from '@manatsu/shared';

export interface UseInvokeOptions<Data> {
  /** Arguments to pass to the command. */
  readonly args?: MaybeNullishRef<InvokeArgs>;
  /** @default false */
  readonly deep?: boolean;
  /** @default false */
  readonly lazy?: boolean;
  /** A ref to indicate if the command is currently loading. */
  readonly loading?: Ref<boolean>;
  /** @default true */
  readonly shallow?: boolean;

  readonly onError?: Nullish<ErrorHandler>;
  readonly transform?: (value: Data) => MaybePromise<Data>;
}

export interface UseInvokeReturn<Data> {
  readonly execute: () => Promise<void>;
  readonly state: Ref<Data>;
  readonly stop: () => void;
}
