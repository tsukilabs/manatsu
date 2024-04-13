import type { MaybeNullishRef } from '@manatsu/shared';
import type { MaybePromise } from '@tb-dev/utility-types';

export type ContextMenuEventHandler = (e: MouseEvent) => MaybePromise<void>;

export interface OnContextMenuOptions {
  /** @default true */
  enabled?: MaybeNullishRef<boolean>;
  /** @default true */
  prevent?: boolean;
}
