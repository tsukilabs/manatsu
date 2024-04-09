import type { MaybePromise } from '@tb-dev/utility-types';

export type ContextMenuEventHandler = (e: MouseEvent) => MaybePromise<void>;

export interface OnContextMenuOptions {
  /** @default true */
  readonly prevent?: boolean;
}
