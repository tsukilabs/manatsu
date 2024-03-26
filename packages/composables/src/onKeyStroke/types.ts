import type { MaybePromise, Nullish } from '@tb-dev/utility-types';

export type KeyStrokeEventHandler = Nullish<(event: KeyboardEvent) => MaybePromise<any>>;
