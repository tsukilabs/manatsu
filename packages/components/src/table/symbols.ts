import type { InjectionKey, ShallowRef } from 'vue';
import type { TableColumnMap } from './types';

export const columnMapKey = Symbol() as InjectionKey<ShallowRef<TableColumnMap>>;
