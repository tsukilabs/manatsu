import type { MaybeNullishRef } from '@manatsu/shared';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import type { OnKeyStrokeOptions as OnKeyStrokeOptionsOriginal } from '@vueuse/core';

export type KeyStrokeEventHandler = Nullish<(event: KeyboardEvent) => MaybePromise<any>>;

export interface OnKeyStrokeOptions extends OnKeyStrokeOptionsOriginal {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;

  /** @default true */
  enabled?: MaybeNullishRef<boolean>;
  /** @default true */
  prevent?: boolean;
}

export type PreventKeyStrokeOptions = Omit<OnKeyStrokeOptions, 'preventDefault'>;
