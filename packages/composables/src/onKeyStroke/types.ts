import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import type { OnKeyStrokeOptions as OnKeyStrokeOptionsOriginal } from '@vueuse/core';

export type KeyStrokeEventHandler = Nullish<(event: KeyboardEvent) => MaybePromise<any>>;

export interface AuxiliarKeys {
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

export type OnKeyStrokeOptions = OnKeyStrokeOptionsOriginal & AuxiliarKeys;
