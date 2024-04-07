import type { MaybeRefOrGetter } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;
