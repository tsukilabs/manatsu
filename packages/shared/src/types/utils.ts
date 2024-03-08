import type { MaybeRefOrGetter } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

// Manatsu
export type DarkMode = boolean | 'auto';
export type SortOrder = 'asc' | 'desc';

// Vue
export type MaybeNullishRef<T> = MaybeRefOrGetter<Nullish<T>>;
