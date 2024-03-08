import type { InjectionKey, ShallowRef } from 'vue';
import type { ColumnMap } from './types';

export const columnMapKey = Symbol() as InjectionKey<ShallowRef<ColumnMap>>;
