import type { MaybePromise, Nullish } from '@tb-dev/utility-types';

export type EventHandler = Nullish<(event: KeyboardEvent) => MaybePromise<any>>;
