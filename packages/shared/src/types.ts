import type { MaybeRefOrGetter } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

export type DarkMode = boolean | 'auto';

export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;
